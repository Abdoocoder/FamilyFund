import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // TODO: Check if user has admin role
    // if (identity.role !== "admin") throw new Error("Forbidden");

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // TODO: Check if user has admin role
    // if (identity.role !== "admin") throw new Error("Forbidden");

    const { memberId, ...updates } = args;
    await ctx.db.patch(memberId, updates);

    return memberId;
  },
});

// Archive a member (soft delete)
export const archiveMember = mutation({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // TODO: Check if user has admin role
    // if (identity.role !== "admin") throw new Error("Forbidden");

    await ctx.db.patch(args.memberId, { is_active: false });

    // Log the action
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

// Restore an archived member
export const restoreMember = mutation({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // TODO: Check if user has admin role
    // if (identity.role !== "admin") throw new Error("Forbidden");

    await ctx.db.patch(args.memberId, { is_active: true });

    // Log the action
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
