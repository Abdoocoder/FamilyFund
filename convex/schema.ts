import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // Auth tables from Clerk
  ...authTables,

  // Members table
  members: defineTable({
    full_name: v.string(),
    phone: v.optional(v.string()),
    branch: v.optional(v.string()), // e.g. آل محمد, آل عبد العزيز
    is_active: v.boolean(),
    role: v.optional(v.string()), // "admin" or "member" (default)
    approval_status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ), // Default: "pending" for new registrations
    subscription_amount: v.number(), // e.g., 200 JOD/month
    clerk_user_id: v.optional(v.string()), // Links to Clerk auth user
    created_at: v.number(),
    created_by: v.string(), // user ID who created the member
  })
    .index("by_is_active", ["is_active"])
    .index("by_created_at", ["created_at"])
    .index("by_role", ["role"])
    .index("by_clerk_user_id", ["clerk_user_id"])
    .index("by_approval_status", ["approval_status"]),

  // Payments table
  payments: defineTable({
    member_id: v.id("members"),
    year: v.number(),
    month: v.number(), // 1-12
    is_paid: v.boolean(),
    amount: v.number(),
    paid_at: v.optional(v.number()),
    payment_method: v.optional(v.string()), // cash, transfer, card
    note: v.optional(v.string()),
    updated_by: v.string(), // user ID who updated the payment
    updated_at: v.number(),
  })
    .index("by_member_id", ["member_id"])
    .index("by_year_month", ["year", "month"])
    .index("by_member_year_month", ["member_id", "year", "month"])
    .index("by_is_paid", ["is_paid"]),

  // Audit logs table
  audit_logs: defineTable({
    payment_id: v.optional(v.id("payments")),
    member_id: v.id("members"),
    action: v.string(), // "add_member", "edit_member", "restore_member", "record_payment", "edit_payment"
    performed_by: v.string(), // user ID
    details: v.string(),
    timestamp: v.number(),
  })
    .index("by_member_id", ["member_id"])
    .index("by_payment_id", ["payment_id"])
    .index("by_timestamp", ["timestamp"])
    .index("by_action", ["action"]),
});
