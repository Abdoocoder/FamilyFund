# CSO Audit Security Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 7 security findings from the CSO audit — privilege escalation, missing auth checks, and exposure of internal data.

**Architecture:** Add ownership validation to `linkClerkUser`, convert `migrateFromLocalStorage` to `internalMutation`, add admin role checks to `getRecentAuditLogs` and `getPendingMembers`, add basic auth checks to public read queries, and extract a `requireAuth` helper.

**Tech Stack:** Convex (TypeScript), Clerk auth

---

## File Map

| File | Changes |
|------|---------|
| `convex/members.ts` | Fix `linkClerkUser` ownership, add auth to `getActiveMembers`, `getMember`, `getPaymentsByMember` queries, add `requireAuth` helper |
| `convex/payments.ts` | Add auth to `getPaymentsByMonth`, `getPayment`, `getRecentPayments` queries |
| `convex/auditLogs.ts` | Add admin role check to `getRecentAuditLogs` |
| `convex/migrateFromLocalStorage.ts` | Change `mutation` to `internalMutation` |

---

### Task 1: Fix `linkClerkUser` privilege escalation

**Files:**
- Modify: `convex/members.ts:154-166`

**The bug:** Any authenticated user can call `linkClerkUser({ memberId: X })` to link ANY member record (including admin records) to their own Clerk ID. This is a privilege escalation — a regular user could become admin by linking themselves to an admin's member record.

- [ ] **Step 1: Add ownership check to `linkClerkUser`**

```typescript
// convex/members.ts — replace the existing linkClerkUser (lines 154-166)
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
```

- [ ] **Step 2: Verify the fix compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add convex/members.ts
git commit -m "fix(security): add ownership check to linkClerkUser to prevent privilege escalation"
```

---

### Task 2: Convert `migrateFromLocalStorage` to internal mutation

**Files:**
- Modify: `convex/migrateFromLocalStorage.ts:1-6`

**The bug:** `migrateFromLocalStorage` is a public mutation (callable from any client). It should be an `internalMutation` — only callable from other Convex functions, not from the frontend.

- [ ] **Step 1: Change import and export**

```typescript
// convex/migrateFromLocalStorage.ts — line 1: change import
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Migration script to import localStorage data into Convex
// Run this ONCE after deploying the new schema
export const migrateFromLocalStorage = internalMutation({
```

- [ ] **Step 2: Verify the fix compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add convex/migrateFromLocalStorage.ts
git commit -m "fix(security): convert migrateFromLocalStorage to internalMutation"
```

---

### Task 3: Add admin check to `getRecentAuditLogs`

**Files:**
- Modify: `convex/auditLogs.ts:123-146`

**The bug:** `getRecentAuditLogs` has no auth or admin check. Any user (even unauthenticated) can read audit logs. All other audit log queries require auth + admin.

- [ ] **Step 1: Add auth + admin check**

```typescript
// convex/auditLogs.ts — replace getRecentAuditLogs (lines 123-146)
export const getRecentAuditLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Admin check (consistent with other audit log queries)
    const member = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      .first();
    if (!member || member.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

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
```

- [ ] **Step 2: Verify the fix compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add convex/auditLogs.ts
git commit -m "fix(security): add admin role check to getRecentAuditLogs"
```

---

### Task 4: Add admin check to `getPendingMembers`

**Files:**
- Modify: `convex/members.ts:288-300`

**The bug:** `getPendingMembers` only checks authentication, not admin role. Any authenticated user can see pending registrations. This should be admin-only since it's used in `AdminPanel.tsx`.

- [ ] **Step 1: Add admin role check**

```typescript
// convex/members.ts — replace getPendingMembers (lines 288-300)
export const getPendingMembers = query({
  args: {},
  handler: async (ctx) => {
    const { identity } = await requireAdmin(ctx);

    const pending = await ctx.db
      .query("members")
      .withIndex("by_approval_status", (q) => q.eq("approval_status", "pending"))
      .collect();

    return pending;
  },
});
```

- [ ] **Step 2: Verify the fix compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add convex/members.ts
git commit -m "fix(security): add admin role check to getPendingMembers"
```

---

### Task 5: Add auth checks to public read queries in `members.ts`

**Files:**
- Modify: `convex/members.ts:21-51` (getActiveMembers, getMember, searchMembers)

**The issue:** `getActiveMembers`, `getMember`, and `searchMembers` have no auth checks. While these are family fund data (low sensitivity), adding basic auth ensures only authenticated users can query the database.

- [ ] **Step 1: Add auth to `getActiveMembers`**

```typescript
// convex/members.ts — replace getActiveMembers (lines 21-30)
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
```

- [ ] **Step 2: Add auth to `getMember`**

```typescript
// convex/members.ts — replace getMember (lines 45-51)
export const getMember = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const member = await ctx.db.get("members", args.memberId);
    return member;
  },
});
```

- [ ] **Step 3: Add auth to `searchMembers`**

```typescript
// convex/members.ts — replace searchMembers (lines 139-151)
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
```

- [ ] **Step 4: Verify the fix compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add convex/members.ts
git commit -m "fix(security): add auth checks to getActiveMembers, getMember, searchMembers"
```

---

### Task 6: Add auth checks to public read queries in `payments.ts`

**Files:**
- Modify: `convex/payments.ts:5-49,264-287` (getPaymentsByMember, getPaymentsByMonth, getPayment, getRecentPayments)

**The issue:** `getPaymentsByMember`, `getPaymentsByMonth`, `getPayment`, and `getRecentPayments` have no auth checks.

- [ ] **Step 1: Add auth to `getPaymentsByMember`**

```typescript
// convex/payments.ts — replace getPaymentsByMember (lines 5-14)
export const getPaymentsByMember = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_member_id", (q) => q.eq("member_id", args.memberId))
      .collect();
    return payments;
  },
});
```

- [ ] **Step 2: Add auth to `getPaymentsByMonth`**

```typescript
// convex/payments.ts — replace getPaymentsByMonth (lines 17-28)
export const getPaymentsByMonth = query({
  args: { year: v.number(), month: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_year_month", (q) =>
        q.eq("year", args.year).eq("month", args.month)
      )
      .collect();
    return payments;
  },
});
```

- [ ] **Step 3: Add auth to `getPayment`**

```typescript
// convex/payments.ts — replace getPayment (lines 31-49)
export const getPayment = query({
  args: {
    memberId: v.id("members"),
    year: v.number(),
    month: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

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
```

- [ ] **Step 4: Add auth to `getRecentPayments`**

```typescript
// convex/payments.ts — replace getRecentPayments (lines 264-287)
export const getRecentPayments = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

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
```

- [ ] **Step 5: Verify the fix compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add convex/payments.ts
git commit -m "fix(security): add auth checks to payment read queries"
```

---

### Task 7: Final verification

- [ ] **Step 1: Full typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Review all changes**

Run: `git diff --stat`
Expected: 4 files changed (members.ts, payments.ts, auditLogs.ts, migrateFromLocalStorage.ts)

- [ ] **Step 4: Final commit if any fixups needed**

```bash
git add -A
git commit -m "fix(security): CSO audit fixes — all findings addressed"
```
