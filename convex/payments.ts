import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all payments for a specific member
export const getPaymentsByMember = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_member_id", (q) => q.eq("member_id", args.memberId))
      .collect();
    return payments;
  },
});

// Get all payments for a specific year and month
export const getPaymentsByMonth = query({
  args: { year: v.number(), month: v.number() },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_year_month", (q) =>
        q.eq("year", args.year).eq("month", args.month)
      )
      .collect();
    return payments;
  },
});

// Get payment for a specific member, year, and month
export const getPayment = query({
  args: {
    memberId: v.id("members"),
    year: v.number(),
    month: v.number(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_member_year_month", (q) =>
        q
          .eq("member_id", args.memberId)
          .eq("year", args.year)
          .eq("month", args.month)
      )
      .first();
    return payment;
  },
});

// Get payment matrix data (all members with their payments for a year)
export const getPaymentMatrix = query({
  args: { year: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Get all active members
    const members = await ctx.db
      .query("members")
      .withIndex("by_is_active", (q) => q.eq("is_active", true))
      .collect();

    // Get all payments for this year
    const allPayments = await ctx.db
      .query("payments")
      .withIndex("by_year_month", (q) => q.eq("year", args.year))
      .collect();

    // Build payment matrix
    const matrix = members.map((member) => {
      const memberPayments = allPayments.filter(
        (p) => p.member_id === member._id
      );

      // Create array for 12 months
      const months = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const payment = memberPayments.find((p) => p.month === month);
        return {
          month,
          is_paid: payment?.is_paid ?? false,
          amount: payment?.amount ?? member.subscription_amount,
          paid_at: payment?.paid_at,
          payment_method: payment?.payment_method,
        };
      });

      return {
        member,
        months,
      };
    });

    return matrix;
  },
});

// Toggle payment status (mark as paid/unpaid)
export const togglePayment = mutation({
  args: {
    memberId: v.id("members"),
    year: v.number(),
    month: v.number(),
    is_paid: v.boolean(),
    payment_method: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Admin check
    const member = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      .first();
    if (!member || member.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

    // Check if payment record exists
    const existingPayment = await ctx.db
      .query("payments")
      .withIndex("by_member_year_month", (q) =>
        q
          .eq("member_id", args.memberId)
          .eq("year", args.year)
          .eq("month", args.month)
      )
      .first();

    if (existingPayment) {
      // Update existing payment
      await ctx.db.patch(existingPayment._id, {
        is_paid: args.is_paid,
        paid_at: args.is_paid ? Date.now() : undefined,
        payment_method: args.is_paid ? args.payment_method : undefined,
        note: args.note,
        updated_by: identity.subject,
        updated_at: Date.now(),
      });

      // Log the action
      await ctx.db.insert("audit_logs", {
        payment_id: existingPayment._id,
        member_id: args.memberId,
        action: args.is_paid ? "record_payment" : "cancel_payment",
        performed_by: identity.subject,
        details: args.is_paid
          ? `تم تسجيل دفعة ${args.month}/${args.year}`
          : `تم إلغاء دفعة ${args.month}/${args.year}`,
        timestamp: Date.now(),
      });

      return existingPayment._id;
    } else {
      // Get member to get subscription amount
      const member = await ctx.db.get("members", args.memberId);
      if (!member) throw new Error("Member not found");

      // Create new payment record
      const paymentId = await ctx.db.insert("payments", {
        member_id: args.memberId,
        year: args.year,
        month: args.month,
        is_paid: args.is_paid,
        amount: member.subscription_amount,
        paid_at: args.is_paid ? Date.now() : undefined,
        payment_method: args.is_paid ? args.payment_method : undefined,
        note: args.note,
        updated_by: identity.subject,
        updated_at: Date.now(),
      });

      // Log the action
      await ctx.db.insert("audit_logs", {
        payment_id: paymentId,
        member_id: args.memberId,
        action: args.is_paid ? "record_payment" : "create_payment",
        performed_by: identity.subject,
        details: args.is_paid
          ? `تم تسجيل دفعة ${args.month}/${args.year}`
          : `تم إنشاء سجل دفعة ${args.month}/${args.year}`,
        timestamp: Date.now(),
      });

      return paymentId;
    }
  },
});

// Batch update payments for multiple members
export const batchUpdatePayments = mutation({
  args: {
    updates: v.array(
      v.object({
        memberId: v.id("members"),
        year: v.number(),
        month: v.number(),
        is_paid: v.boolean(),
        payment_method: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Admin check
    const member = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      .first();
    if (!member || member.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

    const results = [];
    for (const update of args.updates) {
      const existingPayment = await ctx.db
        .query("payments")
        .withIndex("by_member_year_month", (q) =>
          q
            .eq("member_id", update.memberId)
            .eq("year", update.year)
            .eq("month", update.month)
        )
        .first();

      if (existingPayment) {
        await ctx.db.patch(existingPayment._id, {
          is_paid: update.is_paid,
          paid_at: update.is_paid ? Date.now() : undefined,
          payment_method: update.is_paid ? update.payment_method : undefined,
          updated_by: identity.subject,
          updated_at: Date.now(),
        });
        results.push(existingPayment._id);
      } else {
        const member = await ctx.db.get("members", update.memberId);
        if (!member) continue;

        const paymentId = await ctx.db.insert("payments", {
          member_id: update.memberId,
          year: update.year,
          month: update.month,
          is_paid: update.is_paid,
          amount: member.subscription_amount,
          paid_at: update.is_paid ? Date.now() : undefined,
          payment_method: update.is_paid ? update.payment_method : undefined,
          updated_by: identity.subject,
          updated_at: Date.now(),
        });
        results.push(paymentId);
      }
    }

    return results;
  },
});

// Get recent payments (for dashboard)
export const getRecentPayments = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_is_paid", (q) => q.eq("is_paid", true))
      .order("desc")
      .take(limit);

    // Enrich with member names
    const enrichedPayments = await Promise.all(
      payments.map(async (payment) => {
        const member = await ctx.db.get("members", payment.member_id);
        return {
          ...payment,
          member_name: member?.full_name ?? "غير معروف",
        };
      })
    );

    return enrichedPayments;
  },
});
