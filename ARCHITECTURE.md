# FamilyFund Architecture Diagram

```mermaid
graph TB
    subgraph "Data Layer"
        LS[(localStorage)]
        GS[FundContext<br/>Global State]
    end

    subgraph "Core Types"
        MT[Member<br/>id, nameAr, nameEn, phone, status]
        PT[PaymentRecord<br/>memberId, month, paid, amount, method]
        AT[AuditLog<br/>id, timestamp, action, details]
        HT[HistoryEntry<br/>memberId, date, amount, month, method]
    end

    subgraph "Views"
        DV[DashboardView<br/>KPIs, Charts, Recent]
        MV[MembersView<br/>CRUD, Archive/Restore]
        PMV[PaymentMatrixView<br/>12-Month Grid, Export]
        HV[HistoryView<br/>Personal + Global]
    end

    subgraph "Modals"
        ANM[AddMemberModal<br/>Add/Edit Member]
        NPM[NewPaymentModal<br/>Record Payment]
    end

    subgraph "Navigation"
        HD[Header<br/>New Payment Button]
        SB[Sidebar<br/>Desktop Nav]
        BN[BottomNav<br/>Mobile Nav]
    end

    subgraph "State Management"
        IM[initialMembers.ts<br/>48 Members + Helpers]
        IM --> GS
        GS --> LS
        GS --> DV
        GS --> MV
        GS --> PMV
        GS --> HV
    end

    subgraph "Component Flow"
        HD --> NPM
        SB --> DV
        SB --> MV
        SB --> PMV
        SB --> HV
        BN --> DV
        BN --> MV
        BN --> PMV
        BN --> HV
        MV --> ANM
        DV --> NPM
    end

    subgraph "Data Flow"
        User((User)) --> HD
        User --> SB
        User --> BN
        User --> DV
        User --> MV
        User --> PMV
        User --> HV
    end

    classDef data fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef view fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef modal fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef nav fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef type fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    class LS,GS data
    class DV,MV,PMV,HV view
    class ANM,NPM modal
    class HD,SB,BN nav
    class MT,PT,AT,HT type
```

## Component Relationships

### State Management (FundContext)
- **members[]**: 48 family members with Arabic/English names, phone, join date, status
- **payments[]**: Payment records per member per month (amount, method, date)
- **auditLogs[]**: Action audit trail for all mutations
- **personalHistory[]**: Individual payment history per member

### Data Persistence
- All data stored in localStorage with keys:
  - `familyFund_members`
  - `familyFund_payments`
  - `familyFund_auditLogs`
  - `familyFund_personalHistory`

### View Components
1. **DashboardView**: KPIs (total members, active, total amount), bar chart (6 months), recent transactions
2. **MembersView**: Member list with search, archive/restore, add/edit modal
3. **PaymentMatrixView**: 12-month grid, toggle paid/unpaid, search, CSV export
4. **HistoryView**: Personal history (per member) + global history (all members)

### Navigation Flow
- **Header**: Fixed top bar with "New Payment" button
- **Sidebar**: Desktop navigation (left side, RTL-aware)
- **BottomNav**: Mobile navigation (bottom bar)

### Modal Interactions
- **AddMemberModal**: Used by MembersView for add/edit operations
- **NewPaymentModal**: Used by Header and DashboardView for recording payments

### Helper Functions (initialMembers.ts)
- `getMonthlyPaymentStatus()`: Computes payment status for a member in a given month
- `getPaymentStatusForMonth()`: Returns payment status for display
- `formatCurrency()`: Formats amount as SAR currency
- `generateId()`: Generates unique IDs for members and payments
