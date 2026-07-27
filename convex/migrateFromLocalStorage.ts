import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Migration script to import localStorage data into Convex
// Run this ONCE after deploying the new schema
export const migrateFromLocalStorage = mutation({
  args: {
    members: v.array(
      v.object({
        full_name: v.string(),
        phone: v.optional(v.string()),
        branch: v.optional(v.string()),
        subscription_amount: v.number(),
        is_active: v.boolean(),
      })
    ),
    adminClerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    if (identity.subject !== args.adminClerkUserId) {
      throw new Error("Only the designated admin can run migration");
    }

    // Check if migration already ran (members exist)
    const existingCount = (await ctx.db.query("members").collect()).length;
    if (existingCount > 0) {
      throw new Error(
        `Migration already completed: ${existingCount} members exist. Aborting to prevent duplicates.`
      );
    }

    const memberIds = [];

    for (const member of args.members) {
      const memberId = await ctx.db.insert("members", {
        full_name: member.full_name,
        phone: member.phone,
        branch: member.branch,
        subscription_amount: member.subscription_amount,
        is_active: member.is_active,
        role: "member",
        approval_status: "approved",
        clerk_user_id: undefined,
        created_at: Date.now(),
        created_by: identity.subject,
      });
      memberIds.push(memberId);
    }

    // Set up the admin user
    const adminMember = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerk_user_id", args.adminClerkUserId)
      )
      .first();

    if (adminMember) {
      await ctx.db.patch(adminMember._id, {
        role: "admin",
        approval_status: "approved",
      });
    } else {
      // Admin doesn't have a member record yet — create a placeholder
      await ctx.db.insert("members", {
        full_name: "المحاسب (Admin)",
        is_active: true,
        role: "admin",
        approval_status: "approved",
        subscription_amount: 0,
        clerk_user_id: args.adminClerkUserId,
        created_at: Date.now(),
        created_by: identity.subject,
      });
    }

    return { migrated: memberIds.length, memberIds };
  },
});
