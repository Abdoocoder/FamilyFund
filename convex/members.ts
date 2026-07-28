import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper: Check if current user is admin
async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const member = await ctx.db
    .query("members")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerk_user_id", identity.subject))
    .first();

  if (!member) throw new Error("Member not found for this user");
  if (member.role !== "admin") throw new Error("Forbidden: admin role required");

  return { identity, member };
}

// Get all active members
export const getActiveMembers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const members = await ctx.db
      .query("members")
      .withIndex("by_is_active", (q) => q.eq("is_active", true))
      .collect();
    return members;
  },
});

// Get all members (including archived)
export const getAllMembers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const members = await ctx.db.query("members").collect();
    return members;
  },
});

// Get a single member by ID
export const getMember = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const member = await ctx.db.get("members", args.memberId);
    return member;
  },
});

// Add a new member (admin only)
export const addMember = mutation({
  args: {
    full_name: v.string(),
    phone: v.optional(v.string()),
    branch: v.optional(v.string()),
    subscription_amount: v.number(),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);

    const memberId = await ctx.db.insert("members", {
      full_name: args.full_name,
      phone: args.phone,
      branch: args.branch,
      is_active: true,
      approval_status: "pending",
      subscription_amount: args.subscription_amount,
      created_at: Date.now(),
      created_by: identity.subject,
    });

    return memberId;
  },
});

// Update a member (admin only)
export const updateMember = mutation({
  args: {
    memberId: v.id("members"),
    full_name: v.optional(v.string()),
    phone: v.optional(v.string()),
    branch: v.optional(v.string()),
    subscription_amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { memberId, ...updates } = args;
    await ctx.db.patch(memberId, updates);

    return memberId;
  },
});

// Archive a member (soft delete, admin only)
export const archiveMember = mutation({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);

    await ctx.db.patch(args.memberId, { is_active: false });

    await ctx.db.insert("audit_logs", {
      member_id: args.memberId,
      action: "archive_member",
      performed_by: identity.subject,
      details: "تم أرشفة العضو",
      timestamp: Date.now(),
    });

    return args.memberId;
  },
});

// Restore an archived member (admin only)
export const restoreMember = mutation({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);

    await ctx.db.patch(args.memberId, { is_active: true });

    await ctx.db.insert("audit_logs", {
      member_id: args.memberId,
      action: "restore_member",
      performed_by: identity.subject,
      details: "تمت استعادة العضو",
      timestamp: Date.now(),
    });

    return args.memberId;
  },
});

// Search members by name
export const searchMembers = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const allMembers = await ctx.db.query("members").collect();
    const query = args.searchQuery.toLowerCase();

    return allMembers.filter(
      (member) =>
        member.full_name.toLowerCase().includes(query) ||
        member.phone?.toLowerCase().includes(query)
    );
  },
});

// Link Clerk user to member record
export const linkClerkUser = mutation({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Ownership check: user can only link their own Clerk ID to their own member record
    const member = await ctx.db.get("members", args.memberId);
    if (!member) throw new Error("Member not found");
    if (member.clerk_user_id && member.clerk_user_id !== identity.subject) {
      throw new Error("Forbidden: cannot link another user's account");
    }

    await ctx.db.patch(args.memberId, {
      clerk_user_id: identity.subject,
    });

    return args.memberId;
  },
});

// Get current user's member record
export const getCurrentMember = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      .first();

    return member;
  },
});

// List all users (for admin to link accounts)
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Get all members with their linked user IDs
    const members = await ctx.db.query("members").collect();
    return members.map(m => ({
      _id: m._id,
      full_name: m.full_name,
      clerk_user_id: m.clerk_user_id,
      role: m.role,
    }));
  },
});

// Register a new user (creates pending member record)
export const registerUser = mutation({
  args: {
    full_name: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check if user already registered
    const existing = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      .first();
    
    if (existing) throw new Error("User already registered");

    const memberId = await ctx.db.insert("members", {
      full_name: args.full_name,
      phone: args.phone,
      is_active: false, // Not active until approved
      role: "member",
      subscription_amount: 200, // Default
      clerk_user_id: identity.subject,
      approval_status: "pending",
      created_at: Date.now(),
      created_by: identity.subject,
    });

    return memberId;
  },
});

// Approve a user (admin only)
export const approveUser = mutation({
  args: {
    memberId: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);

    await ctx.db.patch(args.memberId, {
      approval_status: "approved",
      is_active: true,
      role: args.role,
    });

    await ctx.db.insert("audit_logs", {
      member_id: args.memberId,
      action: "approve_user",
      performed_by: identity.subject,
      details: `تمت الموافقة على العضو وتحديد الدور: ${args.role}`,
      timestamp: Date.now(),
    });

    return args.memberId;
  },
});

// Reject a user (admin only)
export const rejectUser = mutation({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);

    await ctx.db.patch(args.memberId, {
      approval_status: "rejected",
    });

    await ctx.db.insert("audit_logs", {
      member_id: args.memberId,
      action: "reject_user",
      performed_by: identity.subject,
      details: "تم رفض طلب العضوية",
      timestamp: Date.now(),
    });

    return args.memberId;
  },
});

// Get pending members (admin only)
export const getPendingMembers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const pending = await ctx.db
      .query("members")
      .withIndex("by_approval_status", (q) => q.eq("approval_status", "pending"))
      .collect();

    return pending;
  },
});
