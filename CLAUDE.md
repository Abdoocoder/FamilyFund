# FamilyFund — صندوق العائلة Management System

A React SPA for managing family fund subscriptions with Arabic/RTL support.

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # → dist/
npm run preview    # → preview production build
npm run lint       # → TypeScript type check (tsc --noEmit)
```

### Environment Variables

```bash
cp .env.example .env.local
# Fill in VITE_CLERK_PUBLISHABLE_KEY and VITE_CONVEX_URL
```

## Tech Stack

- **React 19** + **TypeScript 5.8** (ES2022 target, bundler resolution)
- **Vite 6** (dev server with HMR, port 3000)
- **Tailwind CSS v4** (`@theme` tokens, utility-first, RTL-aware)
- **Google Material Symbols** (icon font, `material-symbols-outlined`)
- **GSAP** (ScrollTrigger, staggered entrances) + **Framer Motion** (`motion` package)
- **Clerk** (`@clerk/react` — `useUser`, `SignInButton`, `UserButton`)
- **Convex** (`convex/react`, `convex/react-clerk`) — wired, using localStorage fallback
- **localStorage** for all data persistence (`family_fund_*_v1` keys)
- **Arabic/RTL** interface with IBM Plex Sans Arabic font

## Architecture

```
src/
├── App.tsx                    # Clerk auth gating, tab routing, modal state
├── main.tsx                   # ClerkProvider + ConvexProviderWithClerk setup
├── context/FundContext.tsx    # Core state (members, payments, transactions, audit)
├── types.ts                   # TypeScript interfaces
├── data/initialMembers.ts     # 48 hardcoded members + payment generation + seed transactions
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

## Data Flow

1. **FundContext** (React Context) manages all state:
   - `members[]` — 48 family members with name, phone, branch, subscription amount
   - `payments[]` — per-member per-month payment records (paid/unpaid/pending)
   - `transactions[]` — payment transaction log with relative Arabic dates
   - `auditLogs[]` — action audit trail for all mutations

2. **localStorage** persistence:
   - `family_fund_members_v1`, `family_fund_payments_v1`, `family_fund_transactions_v1`, `family_fund_logs_v1`
   - Data loads on mount; all mutations auto-save via `useEffect`

3. **View components** consume context via `useFund()` hook

4. **Auth flow**: `main.tsx` → `ClerkProvider` → `ConvexProviderWithClerk` → `App.tsx` → checks `isSignedIn` → shows `LandingPage` or `MainContent`

## Conventions

- **Styling**: Tailwind CSS v4 utilities, `surface-elevated` class for cards, status colors (`status-paid`, `status-pending`, `status-danger`)
- **Icons**: `material-symbols-outlined` class, `<span className="material-symbols-outlined">icon_name</span>`, filled variant via `filled` class
- **RTL**: `dir="rtl"` on root, `text-right` default, `dir-ltr` for phone numbers and amounts
- **State**: All via FundContext — no Redux, no external state management
- **TypeScript**: Strict mode, interfaces in `types.ts`, no `any` types
- **Modals**: Native `<dialog>` with `showModal()` / `close()` API — no modal libraries
- **Animations**: GSAP wrapped in `gsap.context()` with `ctx.revert()` cleanup in `useEffect`

## Key Patterns

- **Payment Matrix**: `paymentMap` (`Map<string, PaymentRecord>`) provides O(1) lookups for 576 cells (48 members × 12 months)
- **Undo Toast**: Payment toggles show a 5-second undo toast via `UndoToast` component
- **CSV Export**: UTF-8 with BOM for Arabic Excel compatibility, triggered from `PaymentMatrixView`
- **Archive/Restore**: Members soft-deleted via `status: "archived"` (not removed from array)
- **Audit Trail**: Every add/edit/restore/toggle action logged to `auditLogs[]` via `addAuditLog()`
- **Seed Data**: `initialMembers.ts` generates realistic payment distributions for 2024-2026

## Future Plans

- [ ] Migrate to Next.js (App Router)
- [ ] Activate Convex backend (real-time DB, replace localStorage)
- [ ] Configure Clerk auth with admin/member roles
- [ ] Replace Material Symbols with Lucide icons
- [ ] Add Shadcn UI components
- [ ] Deploy to Vercel

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # TypeScript type check
```
