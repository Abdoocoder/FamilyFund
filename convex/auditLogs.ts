import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all audit logs (admin only)
export const getAllAuditLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // TODO: Check if user has admin role
    // if (identity.role !== "admin") throw new Error("Forbidden");

    const limit = args.limit ?? 50;

    const logs = await ctx.db
      .query("audit_logs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);

    return logs;
  },
});

// Get audit logs for a specific member
export const getAuditLogsByMember = query({
  args: {
    memberId: v.id("members"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const limit = args.limit ?? 20;

    const logs = await ctx.db
      .query("audit_logs")
      .withIndex("by_member_id", (q) => q.eq("member_id", args.memberId))
      .order("desc")
      .take(limit);

    return logs;
  },
});

// Get audit logs for a specific payment
export const getAuditLogsByPayment = query({
  args: {
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const logs = await ctx.db
      .query("audit_logs")
      .withIndex("by_payment_id", (q) => q.eq("payment_id", args.paymentId))
      .order("desc")
      .collect();

    return logs;
  },
});

// Get audit logs by action type
export const getAuditLogsByAction = query({
  args: {
    action: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const limit = args.limit ?? 20;

    const logs = await ctx.db
      .query("audit_logs")
      .withIndex("by_action", (q) => q.eq("action", args.action))
      .order("desc")
      .take(limit);

    return logs;
  },
});

// Get audit logs within a date range
export const getAuditLogsByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const limit = args.limit ?? 50;

    const logs = await ctx.db
      .query("audit_logs")
      .withIndex("by_timestamp", (q) =>
        q.gte("timestamp", args.startDate).lte("timestamp", args.endDate)
      )
      .order("desc")
      .take(limit);

    return logs;
  },
});

// Get recent audit logs (for dashboard)
export const getRecentAuditLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;

    const logs = await ctx.db
      .query("audit_logs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);

    // Enrich with member names
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const member = await ctx.db.get("members", log.member_id);
        return {
          ...log,
          member_name: member?.full_name ?? "غير معروف",
        };
      })
    );

    return enrichedLogs;
  },
});
