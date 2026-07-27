# صندوق العائلة — Family Fund Management System

<div dir="rtl">

> نظام إدارة صندوق الجمعية — يحل محل جداول البيانات اليدوية بشبكة مدفوعات بنقرة واحدة

</div>

A high-performance web application for managing family fund subscriptions (صندوق الجمعية). Features a 1-click payment matrix grid for the Treasurer (المحاسب) and a transparent dashboard for family members.

---

## Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | KPIs, 6-month bar chart, recent transactions |
| **Payment Matrix** | 12-month grid with sticky right column, 1-click toggle (`تم` paid / `—` unpaid) |
| **Member Management** | Add, edit, archive/restore members with search |
| **Payment History** | Personal history per member + global history |
| **CSV Export** | Export payment matrix to spreadsheet |
| **Arabic/RTL** | Full Arabic interface with IBM Plex Sans Arabic font |
| **Responsive** | Desktop sidebar + mobile bottom navigation |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Icons | Google Material Symbols |
| State | React Context + localStorage |
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

---

## Project Structure

```
FamilyFund/
├── src/
│   ├── App.tsx                    # Tab routing, state wiring
│   ├── context/
│   │   └── FundContext.tsx        # Global state (members, payments, audit)
│   ├── types.ts                   # TypeScript interfaces
│   ├── data/
│   │   └── initialMembers.ts     # 48 hardcoded family members
│   ├── components/
│   │   ├── DashboardView.tsx      # KPIs, charts, recent transactions
│   │   ├── PaymentMatrixView.tsx  # 12-month payment grid
│   │   ├── MembersView.tsx        # Member CRUD with archive
│   │   ├── HistoryView.tsx        # Payment history (personal + global)
│   │   ├── Header.tsx             # Top bar with "New Payment" button
│   │   ├── Sidebar.tsx            # Desktop navigation
│   │   ├── BottomNav.tsx          # Mobile navigation
│   │   └── modals/
│   │       ├── AddMemberModal.tsx # Add/edit member
│   │       └── NewPaymentModal.tsx # Record payment
│   └── index.css                  # Tailwind imports, scrollbar styles
├── public/
├── index.html                     # Arabic RTL entry point
├── vite.config.ts                 # Vite + React + Tailwind
├── tsconfig.json                  # ES2022, bundler resolution
├── AGENTS.md                      # Agent instructions
├── ARCHITECTURE.md                # Mermaid diagram + component docs
└── CLAUDE.md                      # Project conventions
```

---

## Data Model

### Members (48 hardcoded)
```typescript
interface Member {
  id: string;
  nameAr: string;           // الاسم بالعربي
  nameEn: string;           // English name
  phone: string;
  joinDate: string;         // ISO date
  status: "active" | "archived";
  monthlyAmount: number;    // Default 500 SAR
}
```

### Payments
```typescript
interface PaymentRecord {
  memberId: string;
  month: string;            // "YYYY-MM"
  paid: boolean;
  amount: number;
  method: "cash" | "transfer" | "card";
  date?: string;
  note?: string;
}
```

### Audit Logs
```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  action: "add_member" | "edit_member" | "restore_member" 
        | "record_payment" | "edit_payment";
  details: string;
  memberId?: string;
}
```

---

## Key Components

### PaymentMatrixView
- Sticky right column for member names (Arabic)
- Horizontal scroll for 12 months
- 1-click toggle: `تم` (paid, green) / `—` (unpaid, red)
- Search by member name
- CSV export functionality

### FundContext
- Central state management via React Context
- localStorage persistence with `familyFund_*` keys
- Handles members, payments, audit logs, personal history

---

## Arabic/RTL Support

- All UI text is in Arabic
- `dir="rtl"` on root `<html>` element
- IBM Plex Sans Arabic font loaded from Google Fonts
- RTL-aware Tailwind utilities (`text-right`, `mr-*` margins)

---

## Future Plans

- [ ] Migrate to Next.js (App Router)
- [ ] Add Clerk authentication (admin/member roles)
- [ ] Integrate Convex backend (real-time DB)
- [ ] Replace Material Symbols with Lucide icons
- [ ] Add Shadcn UI components
- [ ] Deploy to Vercel

---

## Documentation

| File | Purpose |
|------|---------|
| `AGENTS.md` | Agent instructions, conventions, database schema |
| `ARCHITECTURE.md` | Mermaid diagram, component relationships |
| `CLAUDE.md` | Quick start, tech stack, key patterns |
| `graphify-out/GRAPH_REPORT.md` | Knowledge graph analysis |

---

## License

Private — Family use only.
