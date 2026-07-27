# صندوق العائلة — Family Fund Management System

<div dir="rtl">

> نظام إدارة صندوق الجمعية — يحل محل جداول البيانات اليدوية بشبكة مدفوعات بنقرة واحدة

</div>

A high-performance web application for managing family fund subscriptions (صندوق الجمعية). Features a 1-click payment matrix grid for the Treasurer (المحاسب) and a transparent dashboard for family members.

---

## Features

| Feature | Description |
|---------|-------------|
| **Public Landing Page** | Marketing page with GSAP scroll animations, features grid, team section, and Clerk sign-in CTA |
| **Dashboard** | KPIs (expected, collected, remaining, compliance rate), 12-month bar chart with year switcher, recent transactions |
| **Payment Matrix** | 12-month grid with sticky right column, 1-click toggle (`تم` paid / `—` unpaid / `مراجعة` pending), undo toast |
| **Member Management** | Add, edit, archive/restore members with search and branch filtering |
| **Payment History** | Personal history per member + global member status per month |
| **CSV Export** | Export payment matrix to Excel-compatible CSV with Arabic BOM |
| **Undo Toast** | Instant undo when toggling a payment to paid |
| **Clerk Auth** | Sign-in/sign-out via Clerk modals, `UserButton` in header |
| **Arabic/RTL** | Full Arabic interface with IBM Plex Sans Arabic font |
| **Responsive** | Desktop sidebar + mobile bottom navigation |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 (`@theme` tokens) |
| Icons | Google Material Symbols (icon font) |
| Animations | GSAP (ScrollTrigger, staggered entrances) + Framer Motion (`motion` package) |
| Auth | Clerk (`@clerk/react` — `useUser`, `SignInButton`, `UserButton`) |
| Backend | Convex (`convex/react`, `convex/react-clerk`) — wired, using localStorage fallback |
| State | React Context (`FundContext`) + localStorage persistence |
| Font | IBM Plex Sans Arabic |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Type check
npm run lint
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...    # From Clerk Dashboard
VITE_CONVEX_URL=https://...convex.cloud   # From `npx convex dev`
```

---

## Project Structure

```
FamilyFund/
├── src/
│   ├── App.tsx                    # Clerk auth gating, tab routing, modal state
│   ├── main.tsx                   # ClerkProvider + ConvexProviderWithClerk setup
│   ├── context/
│   │   └── FundContext.tsx        # Global state (members, payments, transactions, audit)
│   ├── types.ts                   # TypeScript interfaces
│   ├── data/
│   │   └── initialMembers.ts     # 48 hardcoded members + payment generation + seed transactions
│   ├── components/
│   │   ├── LandingPage.tsx        # Public marketing page (GSAP animations, Arabic)
│   │   ├── DashboardView.tsx      # KPIs, bar chart, recent transactions
│   │   ├── PaymentMatrixView.tsx  # 12-month grid with toggle, search, export, undo
│   │   ├── MembersView.tsx        # Member CRUD with archive/restore
│   │   ├── HistoryView.tsx        # Personal + global payment history
│   │   ├── Header.tsx             # Top bar with Clerk auth, notifications, new payment
│   │   ├── Sidebar.tsx            # Desktop navigation
│   │   ├── BottomNav.tsx          # Mobile navigation
│   │   ├── UndoToast.tsx          # Toast for undoing payment toggles
│   │   └── modals/
│   │       ├── AddMemberModal.tsx  # Add/edit member (native <dialog>)
│   │       └── NewPaymentModal.tsx # Record payment (native <dialog>)
│   └── index.css                  # Tailwind v4 @theme tokens, Material Symbols, utilities
├── public/
├── index.html                     # Arabic RTL entry point
├── vite.config.ts                 # Vite + React + Tailwind
├── tsconfig.json                  # ES2022, bundler resolution
├── .env.example                   # Environment variable template
├── AGENTS.md                      # Agent instructions
├── ARCHITECTURE.md                # Mermaid diagram + component docs
├── CLAUDE.md                      # Project conventions
└── PRODUCT.md                     # Product definition and design principles
```

---

## Data Model

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
  date: string;            // Relative Arabic date (e.g., "اليوم، 10:30 صباحاً")
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

---

## How-To Guides

### How to add a new member
1. Navigate to **الأعضاء** (Members) tab
2. Click **إضافة عضو جديد** (Add New Member)
3. Fill in name, phone, branch (from datalist), and monthly subscription amount
4. Click **إضافة العضو** — 36 payment slots are auto-created (3 years × 12 months)

### How to record a payment
1. Click **دفعة جديدة** (New Payment) in the header or payment matrix
2. Select member, year, month, and amount
3. Add an optional note (e.g., transfer reference)
4. Click **تأكيد وتسجيل الدفعة** — a Transaction is created and the matrix updates

### How to toggle payment status in the matrix
1. Navigate to **المدفوعات** (Payments) tab
2. Find the member row and month column
3. Click the cell — it cycles: `—` (unpaid) → `تم` (paid) → `—` (unpaid)
4. An undo toast appears for 5 seconds if you marked as paid

### How to export to CSV
1. Navigate to **المدفوعات** (Payments) tab
2. Select the year from the dropdown
3. Click **تصدير Excel** (Export Excel)
4. A UTF-8 CSV file downloads with Arabic BOM for Excel compatibility

### How to archive/restore a member
1. Navigate to **الأعضاء** (Members) tab
2. Click **أرشفة** (Archive) on an active member card — confirms with dialog
3. To restore, switch to **المؤرشفين** (Archived) tab and click **استعادة العضو**

---

## Design Decisions

### Why localStorage over a backend?
The fund has ~48 members and operates in a single-family context. localStorage provides instant reads/writes with zero server cost. The Convex backend is wired but dormant — ready for multi-device sync when needed.

### Why native `<dialog>` for modals?
HTML `<dialog>` provides built-in backdrop, focus trapping, Escape-to-close, and `::backdrop` CSS — eliminating the need for a modal library. The `showModal()` / `close()` API is used directly.

### Why Material Symbols over Lucide?
Material Symbols provides a comprehensive Arabic-friendly icon set with variable font axes (`FILL`, `wght`, `GRAD`, `opsz`) that match the app's design language. The `lucide-react` package is installed but unused.

### Why GSAP + Framer Motion?
GSAP handles complex scroll-triggered animations on the landing page (pinning, staggered reveals). Framer Motion (`motion`) is used for the landing page's simpler enter/exit animations. Dashboard components use GSAP for staggered card entrances.

### Why the payment matrix uses a `Map` lookup
The `paymentMap` (`Map<string, PaymentRecord>`) provides O(1) lookups during matrix rendering instead of O(n) `Array.find()` calls per cell — critical for 48 members × 12 months = 576 cells.

---

## Documentation

| File | Purpose |
|------|---------|
| `README.md` | This file — project overview, how-tos, data model |
| `AGENTS.md` | Agent instructions, conventions, database schema |
| `ARCHITECTURE.md` | Mermaid diagram, component relationships, state management |
| `CLAUDE.md` | Quick start, tech stack, key patterns |
| `PRODUCT.md` | Product definition, brand personality, design principles |

---

## License

Private — Family use only.
