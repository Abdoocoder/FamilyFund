# AGENTS.md — Family Fund Management System (نظام إدارة صندوق الجمعية)

## Project Overview
This project is a high-performance, real-time web application designed to manage family fund subscriptions (صندوق الجمعية). It replaces manual spreadsheets with a 1-<literal:char> payment matrix grid for the Treasurer (المحاسب) and a transparent, read-only dashboard for family members.

---

## Tech Stack & Architecture

### Current State (MVP — Production Deployed)
- **Framework**: React 19 + TypeScript 5.8 (SPA, Vite 6)
- **Styling**: Tailwind CSS v4 (`@theme` tokens), Google Material Symbols (icon font)
- **Animations**: GSAP (ScrollTrigger, staggered entrances) + Framer Motion (`motion` package)
- **Auth**: Clerk (`@clerk/react` — `useUser`, `SignInButton`, `UserButton`)
- **Backend**: Convex (`convex/react`, `convex/react-clerk`) — wired in `main.tsx`, using localStorage fallback
- **State**: React Context (FundContext) + localStorage persistence (`family_fund_*_v1` keys)
- **Language**: Arabic/RTL interface with IBM Plex Sans Arabic font

### Target State (Future Migration)
- **Framework**: Next.js (App Router, TypeScript, React 19)
- **Styling & UI**: Tailwind CSS, Shadcn UI, Lucide Icons
- **Backend**: Convex (Reactive Serverless Backend & Realtime DB) — full activation
- **Deployment**: Vercel

---

## Code Style & Conventions

1. **Language & Locales**:
   - Primary interface language is **Arabic (AR)**.
   - All text, labels, messages, and placeholders MUST be in Arabic with native **RTL (Right-To-Left)** layout support (`dir="rtl"`).
   - Use strict TypeScript types across all files (`noImplicitAny: true`).

2. **Component Conventions**:
   - Use **Client Components** (`'use client'` equivalent — all components are client-side in current SPA).
   - Keep components modular, small, and reusable (`components/`).
   - Use native `<dialog>` for modals (not library modals).
   - Use `useFund()` hook to access all global state and actions.

3. **Styling Conventions**:
   - Tailwind CSS v4 utilities — no custom CSS files except `index.css` for theme tokens.
   - Use `surface-elevated` class for card components.
   - Status colors: `status-paid` (green), `status-pending` (amber), `status-danger` (red).
   - RTL-aware: `text-right` default, `dir-ltr` for phone numbers and amounts.

4. **Icon Conventions**:
   - Use Google Material Symbols via `<span className="material-symbols-outlined">icon_name</span>`.
   - Filled variant: add `filled` class or `font-variation-settings: 'FILL' 1`.
   - Do NOT use Lucide icons (installed but unused).

5. **Animation Conventions**:
   - GSAP for complex staggered entrances and scroll-triggered animations.
   - CSS transitions for button hover/active states and micro-interactions.
   - Always use `gsap.context()` with cleanup `ctx.revert()` in `useEffect`.

---

## Database Schema (Current — localStorage)

### Members
```typescript
interface Member {
  id: string;              // "mem-1", "mem-2", ...
  name: string;            // Arabic full name
  phone: string;           // Phone number
  initials: string;        // Arabic initials (e.g., "م.س")
  branch?: string;         // Family branch (e.g., "فرع سالم")
  status: 'active' | 'archived';
  subscriptionAmount: number; // Monthly subscription in JOD (default 200)
  createdAt: string;       // ISO date string
}
```

### Payment Records
```typescript
interface PaymentRecord {
  memberId: string;
  year: number;
  month: MonthNumber;      // 1-12
  status: PaymentStatus;   // 'paid' | 'unpaid' | 'pending'
  amount: number;
  updatedAt?: string;
  note?: string;
}
```

### Transactions
```typescript
interface Transaction {
  id: string;
  memberName: string;
  memberId: string;
  amount: number;
  date: string;            // Relative Arabic date
  isoDate: string;
  status: 'completed' | 'processing' | 'failed';
  monthYear: string;       // e.g., "مارس 2026"
  note?: string;
}
```

### Audit Logs
```typescript
interface AuditLog {
  id: string;
  action: string;          // e.g., "إضافة عضو", "تعديل حالة الدفع"
  performedBy: string;     // Always "المحاسب"
  timestamp: string;
  details: string;
}
```

### Target Schema (Convex — Future)
When migrating to Convex, use this schema in `convex/schema.ts`:
- `members`: `{ full_name: v.string(), phone: v.optional(v.string()), is_active: v.boolean(), created_at: v.number() }`
- `payments`: `{ member_id: v.id("members"), year: v.number(), month: v.number(), is_paid: v.boolean(), paid_at: v.optional(v.number()), updated_by: v.string() }`
- `audit_logs`: `{ payment_id: v.optional(v.id("payments")), member_id: v.id("members"), action: v.string(), performed_by: v.string(), timestamp: v.number() }`

---

## Key Workflows for Agents

1. **Creating/Modifying Mutations**: Ensure every mutation that modifies `payments` writes a corresponding entry to `auditLogs` via `addAuditLog()`.
2. **Access Control**: Currently no role-based access (all users are the Treasurer). When Convex is activated, validate user identity inside Convex backend functions.
3. **Data Importing**: Use seed data in `src/data/initialMembers.ts` when bulk-loading member lists. The `generateInitialPayments()` function creates realistic payment distributions.
4. **Current State**: All data is in localStorage. When migrating to Convex, ensure data migration scripts preserve existing payment history.
5. **Modal Pattern**: Use native `<dialog>` with `showModal()` / `close()` API. No modal libraries.
6. **Animation Pattern**: Always wrap GSAP animations in `gsap.context()` and return `ctx.revert()` from `useEffect` cleanup.

---

## DO NOTs

- ❌ DO NOT introduce SQL ORMs (e.g., Drizzle, Prisma) or external DB clients — **Convex is the single backend source of truth** when activated.
- ❌ DO NOT use hardcoded LTR layouts or English fallback strings in user-facing components.
- ❌ DO NOT place sensitive auth checks solely on the frontend — **always validate user identity inside Convex backend functions** when Convex is activated.
- ❌ DO NOT use `any` type — maintain strict TypeScript throughout.
- ❌ DO NOT add external state management (Redux, Zustand) — Convex handles server state, React Context handles UI state.
- ❌ DO NOT break RTL layout — always test with `dir="rtl"` on root element.
- ❌ DO NOT use Lucide icons — the project uses Material Symbols. `lucide-react` is installed but unused.
- ❌ DO NOT use modal libraries — the project uses native `<dialog>` elements.

---

## File Structure

```
src/
├── App.tsx                    # Clerk auth gating, tab routing, modal state
├── main.tsx                   # ClerkProvider + ConvexProviderWithClerk setup
├── context/
│   └── FundContext.tsx        # Global state (members, payments, transactions, audit)
├── types.ts                   # TypeScript interfaces
├── data/
│   └── initialMembers.ts     # 48 hardcoded members + payment generation + seed transactions
├── components/
│   ├── LandingPage.tsx        # Public marketing page (GSAP animations, Arabic)
│   ├── DashboardView.tsx      # KPIs, bar chart, recent transactions
│   ├── PaymentMatrixView.tsx  # 12-month grid with toggle, search, export, undo
│   ├── MembersView.tsx        # Member CRUD with archive/restore
│   ├── HistoryView.tsx        # Personal + global payment history
│   ├── Header.tsx             # Top bar with Clerk auth, notifications, new payment
│   ├── Sidebar.tsx            # Desktop navigation
│   ├── BottomNav.tsx          # Mobile navigation
│   ├── UndoToast.tsx          # Toast for undoing payment toggles
│   └── modals/
│       ├── AddMemberModal.tsx  # Add/edit member (native <dialog>)
│       └── NewPaymentModal.tsx # Record payment (native <dialog>)
└── index.css                  # Tailwind v4 @theme tokens, Material Symbols, utilities
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
