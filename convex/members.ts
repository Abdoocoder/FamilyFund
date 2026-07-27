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
