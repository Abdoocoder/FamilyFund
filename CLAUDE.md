# FamilyFund — Al-Jama'iyah Management System

A React SPA for managing family fund subscriptions with Arabic/RTL support.

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # → dist/
npm run preview    # → preview production build
npm run lint       # → ESLint check
```

## Tech Stack

- **React 19** + **TypeScript 5.8** (ES2022 target, bundler resolution)
- **Vite 6** (dev server with HMR, port 5173)
- **Tailwind CSS v4** (utility-first, RTL-aware)
- **Google Material Symbols** (icon font, `material-symbols-outlined`)
- **localStorage** for all data persistence (no backend)
- **Arabic/RTL** interface with IBM Plex Sans Arabic font

## Architecture

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

## Data Flow

1. **FundContext** (React Context) manages all state:
   - `members[]` — 48 family members with name, phone, join date, status
   - `payments[]` — payment records per member per month
   - `auditLogs[]` — action audit trail
   - `personalHistory[]` — individual payment history

2. **localStorage** persistence:
   - `familyFund_members`, `familyFund_payments`, `familyFund_auditLogs`, `familyFund_personalHistory`
   - Data loads on mount via `useLocalStorage` hook

3. **View components** consume context via `useFund()` hook

## Conventions

- **Styling**: Tailwind CSS utilities, no custom CSS files (except `index.css` for Tailwind imports)
- **Icons**: `material-symbols-outlined` class, use `<span className="material-symbols-outlined">icon_name</span>`
- **RTL**: `dir="rtl"` on root, text alignment via `text-right`/`text-left`
- **State**: All via FundContext — no Redux, no external state
- **TypeScript**: Strict mode, interfaces in `types.ts`, no `any` types

## Key Patterns

- **PaymentMatrixView**: 12-month grid with `paymentMatrix` computed from `getMonthlyPaymentStatus()` helper
- **Export**: `exportToCsv()` function in `PaymentMatrixView.tsx` for CSV export
- **Archive/Restore**: Members soft-deleted via `status: "archived"` (not removed from array)
- **Audit Trail**: Every add/edit/restore action logged to `auditLogs[]`

## Future Plans

- Next.js migration (SPA → SSR/SSG)
- Convex backend (real-time database)
- Clerk authentication (user management)

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # ESLint
```
