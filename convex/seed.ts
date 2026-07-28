import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Initial 48 family members for "صندوق العائلة" - عائلة أبو كف
const INITIAL_MEMBERS = [
  { full_name: "محمد سالم أبوكف", phone: "", branch: "فرع سالم", subscription_amount: 200 },
  { full_name: "أيمن محمد أبوكف", phone: "", branch: "فرع محمد", subscription_amount: 200 },
  { full_name: "أسامة محمد أبوكف", phone: "", branch: "فرع محمد", subscription_amount: 200 },
  { full_name: "موسى محمد أبوكف", phone: "", branch: "فرع محمد", subscription_amount: 200 },
  { full_name: "سالم محمد أبوكف", phone: "", branch: "فرع محمد", subscription_amount: 200 },
  { full_name: "بلال محمد أبوكف", phone: "", branch: "فرع محمد", subscription_amount: 200 },
  { full_name: "أشرف محمود أبوكف", phone: "", branch: "فرع محمود", subscription_amount: 200 },
  { full_name: "امجد محمود أبوكف", phone: "", branch: "فرع محمود", subscription_amount: 200 },
  { full_name: "أحمد محمود أبوكف", phone: "", branch: "فرع محمود", subscription_amount: 200 },
  { full_name: "إبراهيم محمود أبوكف", phone: "", branch: "فرع محمود", subscription_amount: 200 },
  { full_name: "سعيد محمود أبوكف", phone: "", branch: "فرع محمود", role: "admin", subscription_amount: 200 },
  { full_name: "خالد جمال أبوكف", phone: "", branch: "فرع جمال", subscription_amount: 200 },
  { full_name: "نزال جمال أبوكف", phone: "", branch: "فرع جمال", subscription_amount: 200 },
  { full_name: "محمد جمال أبوكف", phone: "", branch: "فرع جمال", subscription_amount: 200 },
  { full_name: "سالم جمال أبوكف", phone: "", branch: "فرع جمال", subscription_amount: 200 },
  { full_name: "أحمد جمال أبوكف", phone: "", branch: "فرع جمال", subscription_amount: 200 },
  { full_name: "فراس جمال أبوكف", phone: "", branch: "فرع جمال", subscription_amount: 200 },
  { full_name: "راشد فراس أبوكف", phone: "", branch: "فرع فراس", subscription_amount: 200 },
  { full_name: "يزيد فاس أبوكف", phone: "", branch: "فرع فاس", subscription_amount: 200 },
  { full_name: "هاشم عليان أبوكف", phone: "", branch: "فرع عليان", subscription_amount: 200 },
  { full_name: "عليان هاشم أبوكف", phone: "", branch: "فرع هاشم", subscription_amount: 200 },
  { full_name: "إبراهيم هاشم أبوكف", phone: "", branch: "فرع هاشم", subscription_amount: 200 },
  { full_name: "محمود عطا أبوكف", phone: "", branch: "فرع عطا", subscription_amount: 200 },
  { full_name: "محمد عطا أبوكف", phone: "", branch: "فرع عطا", subscription_amount: 200 },
  { full_name: "سلمان خليل أبوكف", phone: "", branch: "فرع خليل", subscription_amount: 200 },
  { full_name: "خالد خليل أبوكف", phone: "", branch: "فرع خليل", subscription_amount: 200 },
  { full_name: "فهد خليل أبوكف", phone: "", branch: "فرع خليل", subscription_amount: 200 },
  { full_name: "محمد خليل أبوكف", phone: "", branch: "فرع خليل", subscription_amount: 200 },
  { full_name: "عمر خليل أبوكف", phone: "", branch: "فرع خليل", subscription_amount: 200 },
  { full_name: "معاذ سلمان أبوكف", phone: "", branch: "فرع سلمان", subscription_amount: 200 },
  { full_name: "قدر سلمان أبوكف", phone: "", branch: "فرع سلمان", subscription_amount: 200 },
  { full_name: "خليل محمد أبوكف", phone: "", branch: "فرع محمد", subscription_amount: 200 },
  { full_name: "صالح سليمان أبوكف", phone: "", branch: "فرع سليمان", subscription_amount: 200 },
  { full_name: "محمد صالح أبوكف", phone: "", branch: "فرع صالح", subscription_amount: 200 },
  { full_name: "أحمد حسن أبوكف", phone: "", branch: "فرع حسن", subscription_amount: 200 },
  { full_name: "عبدالله حسن أبوكف", phone: "", branch: "فرع حسن", subscription_amount: 200 },
  { full_name: "محمد موسى أبوكف", phone: "", branch: "فرع موسى", subscription_amount: 200 },
  { full_name: "بسام موسى أبوكف", phone: "", branch: "فرع موسى", subscription_amount: 200 },
  { full_name: "صالح موسى أبوكف", phone: "", branch: "فرع موسى", subscription_amount: 200 },
  { full_name: "سليمان موسى أبوكف", phone: "", branch: "فرع موسى", subscription_amount: 200 },
  { full_name: "موسى صالح أبوكف", phone: "", branch: "فرع صالح", subscription_amount: 200 },
  { full_name: "كريم علي أبوكف", phone: "", branch: "فرع علي", subscription_amount: 200 },
  { full_name: "خالد علي أبوكف", phone: "", branch: "فرع علي", subscription_amount: 200 },
  { full_name: "محمد علي أبوكف", phone: "", branch: "فرع علي", subscription_amount: 200 },
  { full_name: "سلامة علي أبوكف", phone: "", branch: "فرع علي", subscription_amount: 200 },
  { full_name: "غازي علي أبوكف", phone: "", branch: "فرع علي", subscription_amount: 200 },
  { full_name: "خليل علي أبوكف", phone: "", branch: "فرع علي", subscription_amount: 200 },
  { full_name: "بشار كريم أبوكف", phone: "", branch: "فرع كريم", subscription_amount: 200 },
];

// Seed all members
export const seedMembers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const results = [];

    for (const member of INITIAL_MEMBERS) {
      const memberId = await ctx.db.insert("members", {
        full_name: member.full_name,
        phone: member.phone,
        branch: member.branch,
        is_active: true,
        role: member.role,
        approval_status: "approved",
        subscription_amount: member.subscription_amount,
        created_at: Date.now(),
        created_by: "system",
      });
      results.push(memberId);
    }

    return results;
  },
});

// Seed initial payment records for 2024-2026
export const seedPayments = internalMutation({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("members").collect();
    const results = [];
    const years = [2024, 2025, 2026];

    for (const member of members) {
      for (const year of years) {
        for (let month = 1; month <= 12; month++) {
          let is_paid = false;

          if (year === 2024) {
            // High compliance for 2024
            if (month <= 8) is_paid = true;
            else if (month <= 10 && Math.random() > 0.5) is_paid = true;
          } else if (year === 2025) {
            // Mixed compliance for 2025
            if (month <= 6) is_paid = true;
            else if (Math.random() > 0.6) is_paid = true;
          } else if (year === 2026) {
            // Current year: months 1-3 partially paid
            if (month <= 2) is_paid = Math.random() > 0.3;
            else if (month === 3) is_paid = Math.random() > 0.5;
          }

          const paymentId = await ctx.db.insert("payments", {
            member_id: member._id,
            year,
            month,
            is_paid,
            amount: member.subscription_amount,
            paid_at: is_paid ? Date.now() - Math.random() * 86400000 * 30 : undefined,
            payment_method: is_paid ? "cash" : undefined,
            updated_by: "system",
            updated_at: Date.now(),
          });
          results.push(paymentId);
        }
      }
    }

    return results;
  },
});

// To seed the database, run these commands separately:
//   npx convex run seed:seedMembers
//   npx convex run seed:seedPayments
//
// Or to set the admin role after seeding:
//   npx convex run seed:setAdminRole

// Set admin role for سعيد محمود أبوكف
export const setAdminRole = internalMutation({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("members").collect();
    const saeed = members.find(
      (m) => m.full_name.includes("سعيد") && m.full_name.includes("محمود")
    );

    if (!saeed) throw new Error("Member not found: سعيد محمود أبوكف");

    await ctx.db.patch(saeed._id, { role: "admin" });
    return { member: saeed.full_name, role: "admin" };
  },
});

// List all pending members with their Clerk user IDs
// Run: npx convex run seed:listPendingMembers
export const listPendingMembers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const pending = await ctx.db
      .query("members")
      .withIndex("by_approval_status", (q) => q.eq("approval_status", "pending"))
      .collect();

    return pending.map((m) => ({
      _id: m._id,
      full_name: m.full_name,
      clerk_user_id: m.clerk_user_id,
      approval_status: m.approval_status,
    }));
  },
});

// List ALL members with their Clerk user IDs (for debugging)
// Run: npx convex run seed:listAllMembers
export const listAllMembers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("members").collect();
    return members.map((m) => ({
      _id: m._id,
      full_name: m.full_name,
      clerk_user_id: m.clerk_user_id,
      role: m.role,
      approval_status: m.approval_status,
      is_active: m.is_active,
    }));
  },
});

// Promote a user to admin by their Clerk user ID
// Run: npx convex run seed:promoteToAdmin '{"clerkUserId":"USER_ID_HERE","fullName":"Name"}'
// If no member exists for that Clerk ID, one is created automatically.
export const promoteToAdmin = internalMutation({
  args: {
    clerkUserId: v.string(),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let member = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
      .first();

    if (!member) {
      const memberId = await ctx.db.insert("members", {
        full_name: args.fullName || "عضو جديد",
        is_active: true,
        role: "admin",
        subscription_amount: 200,
        clerk_user_id: args.clerkUserId,
        approval_status: "approved",
        created_at: Date.now(),
        created_by: "system",
      });
      return { member: args.fullName || "عضو جديد", role: "admin", status: "approved", created: true };
    }

    await ctx.db.patch(member._id, {
      role: "admin",
      approval_status: "approved",
      is_active: true,
    });

    return { member: member.full_name, role: "admin", status: "approved", created: false };
  },
});
