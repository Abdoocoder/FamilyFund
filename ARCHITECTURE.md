# FamilyFund Architecture

## System Overview

```mermaid
graph TB
    subgraph "Entry Point"
        MTX[main.tsx<br/>ClerkProvider + ConvexProviderWithClerk]
    end

    subgraph "Auth Gate"
        APP[App.tsx<br/>isSignedIn?]
        LP[LandingPage<br/>Public Marketing]
        MC[MainContent<br/>Authenticated App]
    end

    subgraph "Data Layer"
        LS[(localStorage<br/>family_fund_*_v1)]
        GS[FundContext<br/>Global State Provider]
    end

    subgraph "Core Types"
        MT[Member<br/>id, name, phone, initials, branch, status, subscriptionAmount]
        PT[PaymentRecord<br/>memberId, year, month, status, amount]
        TT[Transaction<br/>id, memberName, amount, date, status, monthYear]
        AT[AuditLog<br/>id, action, performedBy, timestamp, details]
    end

    subgraph "Views"
        DV[DashboardView<br/>KPIs, Bar Chart, Recent Tx]
        MV[MembersView<br/>CRUD, Archive/Restore]
        PMV[PaymentMatrixView<br/>12-Month Grid, Toggle, Export]
        HV[HistoryView<br/>Personal + Global Status]
    end

    subgraph "Modals"
        ANM[AddMemberModal<br/>Add/Edit Member]
        NPM[NewPaymentModal<br/>Record Payment]
    end

    subgraph "Navigation"
        HD[Header<br/>Clerk Auth, Notifications, New Payment]
        SB[Sidebar<br/>Desktop Nav]
        BN[BottomNav<br/>Mobile Nav]
        UT[UndoToast<br/>Payment Undo]
    end

    MTX --> APP
    APP -->|not signed in| LP
    APP -->|signed in| MC
    MC --> GS
    LP --> GS
    GS --> LS

    MC --> HD
    MC --> SB
    MC --> BN
    MC --> DV
    MC --> MV
    MC --> PMV
    MC --> HV

    HD --> NPM
    MV --> ANM
    PMV --> UT

    GS --> DV
    GS --> MV
    GS --> PMV
    GS --> HV

    classDef auth fill:#e3f2fd,stroke:#0d47a1,stroke-width:2px
    classDef data fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef view fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef modal fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef nav fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef type fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    class MTX,APP,LP,MC auth
    class LS,GS data
    class DV,MV,PMV,HV view
    class ANM,NPM modal
    class HD,SB,BN,UT nav
    class MT,PT,TT,AT type
```

---

## Component Relationships

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant LP as LandingPage
    participant Clerk as Clerk
    participant App as App.tsx
    participant MC as MainContent

    U->>LP: Visits app
    LP->>Clerk: SignInButton (modal)
    Clerk->>App: isSignedIn = true
    App->>MC: Render MainContent
    MC->>MC: FundProvider wraps views
```

- `main.tsx` wraps everything in `ClerkProvider` + `ConvexProviderWithClerk`
- `App.tsx` checks `useUser().isSignedIn` — shows `LandingPage` if false, `MainContent` if true
- `Header.tsx` shows `SignInButton` (modal mode) or `UserButton` based on auth state

### State Management (FundContext)

```mermaid
graph LR
    subgraph "FundContext State"
        M[members[]]
        P[payments[]]
        T[transactions[]]
        L[auditLogs[]]
        SY[selectedYear]
        SM[selectedMonth]
        AT2[activeTab]
    end

    subgraph "Actions"
        AM[addMember]
        UM[updateMember]
        TMA[toggleMemberArchive]
        TP[togglePayment]
        RNP[recordNewPayment]
        E[exportToCSV]
        RD[resetData]
    end

    subgraph "Persistence"
        LS[(localStorage)]
    end

    M --> LS
    P --> LS
    T --> LS
    L --> LS

    AM --> M
    AM --> P
    UM --> M
    TMA --> M
    TP --> P
    RNP --> P
    RNP --> T
    E --> M
    E --> P
    RD --> LS
```

**State slices:**
| Slice | Type | Storage Key | Description |
|-------|------|-------------|-------------|
| `members` | `Member[]` | `family_fund_members_v1` | 48 family members with name, phone, branch, subscription |
| `payments` | `PaymentRecord[]` | `family_fund_payments_v1` | Per-member per-month payment status (paid/unpaid/pending) |
| `transactions` | `Transaction[]` | `family_fund_transactions_v1` | Payment transaction log with relative dates |
| `auditLogs` | `AuditLog[]` | `family_fund_logs_v1` | Action audit trail for all mutations |

**Key actions:**
| Action | Effect |
|--------|--------|
| `addMember(data)` | Creates member + 36 payment slots (3 years × 12 months) |
| `updateMember(id, data)` | Partial update on member fields |
| `toggleMemberArchive(id)` | Flips `status` between `active` and `archived` |
| `togglePayment(memberId, year, month)` | Cycles `unpaid` → `paid` → `unpaid` |
| `recordNewPayment(data)` | Sets payment to `paid` + creates Transaction + audit log |
| `exportToCSV()` | Downloads UTF-8 CSV with Arabic BOM |
| `resetData()` | Clears all localStorage keys, reloads seed data |
| `getMemberYearTotal(id, year)` | Sums paid amounts for a member in a year |
| `getYearStats(year)` | Returns `{ expected, collected, remaining, complianceRate }` |

### View Components

| Component | Lines | Purpose | Key Features |
|-----------|-------|---------|--------------|
| `LandingPage.tsx` | 450+ | Public marketing page | GSAP ScrollTrigger, features grid, team section, Clerk CTA |
| `DashboardView.tsx` | 305 | KPIs + charts | 4 KPI cards, 12-month bar chart with year switcher, recent transactions |
| `PaymentMatrixView.tsx` | 306 | Payment grid | Sticky right column, 576 toggle cells, search, filter, CSV export, undo toast |
| `MembersView.tsx` | 205 | Member management | Card grid, search, active/archived/all tabs, archive/restore with confirm |
| `HistoryView.tsx` | 267 | Payment history | Bento layout, personal summary, fund health ring, per-month member status |
| `Header.tsx` | 129 | Top bar | Clerk auth, notifications dropdown, new payment button |
| `Sidebar.tsx` | 69 | Desktop nav | 4 tabs with active member count badge |
| `BottomNav.tsx` | 42 | Mobile nav | 4 tabs, floating bottom bar |
| `UndoToast.tsx` | — | Undo toast | 5-second dismiss, calls `onUndo` callback |

### Modal Components

| Modal | Trigger | Fields |
|-------|---------|--------|
| `AddMemberModal.tsx` | MembersView "Add" / "Edit" button | name, phone, branch (datalist), subscriptionAmount |
| `NewPaymentModal.tsx` | Header / PaymentMatrixView "New Payment" | memberId (select), year, month, amount, note |

Both use native `<dialog>` with `showModal()` / `close()` API.

---

## Data Flow

### Payment Toggle Flow
```mermaid
sequenceDiagram
    participant U as User
    participant PMV as PaymentMatrixView
    participant FC as FundContext
    participant LS as localStorage
    participant UT as UndoToast

    U->>PMV: Click cell (member, month)
    PMV->>FC: togglePayment(memberId, year, month)
    FC->>FC: Cycle unpaid → paid → unpaid
    FC->>LS: Save updated payments[]
    FC-->>PMV: Re-render with new status
    PMV->>UT: Show undo toast (5s)
    U->>UT: Click "Undo" (optional)
    UT->>FC: togglePayment(same args)
    FC->>LS: Save reverted payments[]
```

### New Payment Flow
```mermaid
sequenceDiagram
    participant U as User
    participant NPM as NewPaymentModal
    participant FC as FundContext
    participant LS as localStorage

    U->>NPM: Submit form
    NPM->>FC: recordNewPayment({ memberId, year, month, amount, note })
    FC->>FC: setPaymentStatus → 'paid'
    FC->>FC: Create Transaction object
    FC->>FC: addAuditLog('تسجيل دفعة جديدة')
    FC->>LS: Save payments[], transactions[], auditLogs[]
    FC-->>NPM: onClose()
```

---

## Persistence Architecture

All data lives in `localStorage` with versioned keys:

| Key | Type | Version |
|-----|------|---------|
| `family_fund_members_v1` | `Member[]` | v1 |
| `family_fund_payments_v1` | `PaymentRecord[]` | v1 |
| `family_fund_transactions_v1` | `Transaction[]` | v1 |
| `family_fund_logs_v1` | `AuditLog[]` | v1 |

**Initialization:** On first load (no localStorage), seed data from `initialMembers.ts` is used:
- 48 members with `subscriptionAmount: 200` JOD
- Payment records for 2024, 2025, 2026 with realistic paid/unpaid/pending distribution
- 5 seed transactions with relative Arabic dates

**Convex backend:** Wired in `main.tsx` via `ConvexProviderWithClerk` but currently dormant — all reads/writes go through `FundContext` → `localStorage`. Ready for activation when multi-device sync is needed.

---

## Styling Architecture

### Tailwind CSS v4 Theme Tokens (`index.css`)
```css
@theme {
  --color-fund-green: #154212;        /* Primary brand */
  --color-fund-green-light: #2d5a27;  /* Hover states */
  --color-fund-surface: #f8f9ff;      /* Background */
  --color-fund-border: #e2e8f0;       /* Borders */
  --color-fund-muted: #5c6357;        /* Secondary text */
  --color-fund-text: #0b1c30;         /* Primary text */
  --color-fund-accent: #eff4ff;       /* Accent background */
  --font-family-arabic: 'IBM Plex Sans Arabic', sans-serif;
}
```

### Component Styling Patterns
- **`surface-elevated`**: Card with subtle shadow + border (used by all views)
- **`payment-toggle`**: Micro-interaction with `scale(0.96)` on active
- **Status colors**: `status-paid` (green), `status-pending` (amber), `status-danger` (red)
- **RTL-aware**: `text-right` default, `dir-ltr` for phone numbers

### Animation Stack
- **GSAP**: Staggered card entrances, bar chart growth, slide-from-right for matrix
- **Framer Motion**: Landing page enter/exit animations
- **CSS transitions**: Button hover/active states, payment toggle micro-interaction
