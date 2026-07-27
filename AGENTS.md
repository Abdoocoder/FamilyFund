# AGENTS.md — Family Fund Management System (نظام إدارة صندوق الجمعية)

## Project Overview
This project is a high-performance, real-time web application designed to manage family fund subscriptions (صندوق الجمعية). It replaces manual spreadsheets with a 1-click payment matrix grid for the Treasurer (المحاسب) and a transparent, read-only dashboard for family members.

---

## Tech Stack & Architecture

### Current State (MVP)
- **Framework**: React 19 + TypeScript 5.8 (SPA, Vite 6)
- **Styling**: Tailwind CSS v4, Google Material Symbols
- **State**: React Context (FundContext) + localStorage persistence
- **Language**: Arabic/RTL interface with IBM Plex Sans Arabic font

### Target State (Production)
- **Framework**: Next.js (App Router, TypeScript, React 19)
- **Authentication & Roles**: Clerk Auth (`admin` role for Treasurer, `member` role for family)
- **Backend & Database**: Convex (Reactive Serverless Backend & Realtime DB)
- **Styling & UI**: Tailwind CSS, Shadcn UI, Lucide Icons
- **Deployment**: Vercel

---

## Code Style & Conventions

1. **Language & Locales**:
   - Primary interface language is **Arabic (AR)**.
   - All text, labels, messages, and placeholders MUST be in Arabic with native **RTL (Right-To-Left)** layout support (`dir="rtl"`).
   - Use strict TypeScript types across all files (`noImplicitAny: true`).

2. **Next.js Conventions**:
   - Use the **App Router** (`app/` directory).
   - Keep components modular, small, and reusable (`components/`).
   - Use Client Components (`'use client'`) ONLY when interactive hooks (`useQuery`, `useMutation`, `useState`) are strictly required.

3. **Convex Backend Conventions**:
   - All backend queries and mutations reside inside the `convex/` directory.
   - ALWAYS perform authentication and authorization checks in Convex functions:
     ```ts
     const identity = await ctx.auth.getUserIdentity();
     if (!identity) throw new Error("Unauthorized");
     ```
   - Use `v.id("tableName")` validators for all schema fields and arguments.

4. **UI & UX Constraints**:
   - **Payment Matrix Grid**: Must feature sticky right column for member names, horizontal scrolling for 12 months, and 1-click status toggling (`تم` for paid, `—` for unpaid).
   - **Optimistic UI Updates**: Toggling payment states must feel instantaneous (<50ms) using Convex optimistic updates.

---

## Database Schema (`convex/schema.ts`)

Keep schema mutations aligned with the following structure:

- `members`: `{ full_name: v.string(), phone: v.optional(v.string()), is_active: v.boolean(), created_at: v.number() }`
- `payments`: `{ member_id: v.id("members"), year: v.number(), month: v.number(), is_paid: v.boolean(), paid_at: v.optional(v.number()), updated_by: v.string() }`
- `audit_logs`: `{ payment_id: v.optional(v.id("payments")), member_id: v.id("members"), action: v.string(), performed_by: v.string(), timestamp: v.number() }`

---

## Current Data Model (localStorage)

### Members (48 hardcoded)
```ts
interface Member {
  id: string;
  nameAr: string;           // Arabic name
  nameEn: string;           // English name
  phone: string;            // Phone number
  joinDate: string;         // ISO date string
  status: "active" | "archived";
  monthlyAmount: number;    // Default 500 JOD
}
```

### Payments
```ts
interface PaymentRecord {
  memberId: string;
  month: string;            // "YYYY-MM" format
  paid: boolean;
  amount: number;
  method: "cash" | "transfer" | "card";
  date?: string;            // Payment date
  note?: string;            // Optional note
}
```

### Audit Logs
```ts
interface AuditLog {
  id: string;
  timestamp: string;
  action: "add_member" | "edit_member" | "restore_member" | "record_payment" | "edit_payment";
  details: string;
  memberId?: string;
}
```

---

## Key Workflows for Agents

1. **Creating/Modifying Mutations**: Ensure every mutation that modifies `payments` writes a corresponding entry to `audit_logs`.
2. **Access Control**: Never allow non-admin users to mutate payment statuses or edit member details.
3. **Data Importing**: Use seeding scripts in `convex/seed.ts` when bulk-loading member lists (e.g., initial 48 family members).
4. **Current State**: All data is in localStorage. When migrating to Convex, ensure data migration scripts preserve existing payment history.

---

## DO NOTs

- ❌ DO NOT introduce SQL ORMs (e.g., Drizzle, Prisma) or external DB clients — **Convex is the single backend source of truth**.
- ❌ DO NOT use hardcoded LTR layouts or English fallback strings in user-facing components.
- ❌ DO NOT place sensitive auth checks solely on the frontend — **always validate user identity inside Convex backend functions**.
- ❌ DO NOT use `any` type — maintain strict TypeScript throughout.
- ❌ DO NOT add external state management (Redux, Zustand) — Convex handles server state, React Context handles UI state.
- ❌ DO NOT break RTL layout — always test with `dir="rtl"` on root element.

---

## File Structure

```
src/
├── App.tsx                    # Tab routing, state wiring
├── context/FundContext.tsx    # Core state (members, payments, audit logs)
├── types.ts                   # TypeScript interfaces
├── data/initialMembers.ts     # 48 hardcoded members + helpers
├── hooks/                     # Custom React hooks
├── components/
│   ├── DashboardView.tsx      # KPIs, bar chart, recent transactions
│   ├── PaymentMatrixView.tsx  # 12-month grid with toggle, search, export
│   ├── MembersView.tsx        # Member CRUD with archive/restore
│   ├── HistoryView.tsx        # Personal + global payment history
│   ├── Header.tsx             # Top bar with New Payment button
│   ├── Sidebar.tsx            # Desktop navigation
│   ├── BottomNav.tsx          # Mobile navigation
│   └── modals/
│       ├── AddMemberModal.tsx # Add/edit member
│       └── NewPaymentModal.tsx # Record new payment
```

---

## Migration Checklist (React SPA → Next.js + Convex)

- [ ] Set up Next.js project with App Router
- [ ] Configure Clerk authentication with admin/member roles
- [ ] Create Convex schema (members, payments, audit_logs)
- [ ] Migrate localStorage data to Convex
- [ ] Implement Convex queries and mutations
- [ ] Add optimistic updates for payment toggling
- [ ] Replace Material Symbols with Lucide icons
- [ ] Update UI components to use Shadcn
- [ ] Deploy to Vercel
