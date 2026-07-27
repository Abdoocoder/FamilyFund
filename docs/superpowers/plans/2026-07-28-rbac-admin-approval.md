# RBAC Admin Approval Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement role-based access control with admin approval workflow, where new users must be approved by an administrator before accessing the app.

**Architecture:** Hybrid approach using Convex backend for data storage and role enforcement, Clerk for authentication only. Users register via Clerk, get a "pending" status in Convex, and must be approved by admin before accessing the app. Members get read-only access; admins get full access.

**Tech Stack:** React 19, TypeScript, Convex (backend), Clerk (auth only), Tailwind CSS v4

---

## File Structure

```
src/
├── types.ts                              # Add UserRole, ApprovalStatus types
├── App.tsx                               # Add approval status gating
├── components/
│   ├── PendingApproval.tsx               # NEW - Waiting screen
│   ├── AdminPanel.tsx                    # NEW - Approve/reject users
│   ├── Header.tsx                        # Add admin link
│   ├── PaymentMatrixView.tsx             # Role-based UI
│   └── MembersView.tsx                   # Role-based UI
convex/
├── schema.ts                             # Add approval_status field
├── members.ts                            # Add registerUser, approveUser, rejectUser
├── payments.ts                           # Add admin enforcement
└── auditLogs.ts                          # Add admin enforcement
```

---

## Task 1: Update Convex Schema

**Files:**
- Modify: `convex/schema.ts`

- [ ] **Step 1: Add approval_status field to members table**

```typescript
// convex/schema.ts
// Add to members table definition (after role field):
approval_status: v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected")
), // Default: "pending" for new registrations

// Add index:
.index("by_approval_status", ["approval_status"])
```

- [ ] **Step 2: Verify schema compiles**

Run: `npx convex dev`
Expected: No errors, schema updates

- [ ] **Step 3: Commit**

```bash
git add convex/schema.ts
git commit -m "feat: add approval_status field to members schema"
```

---

## Task 2: Add New Convex Mutations

**Files:**
- Modify: `convex/members.ts`

- [ ] **Step 1: Add registerUser mutation**

```typescript
// convex/members.ts - Add after linkClerkUser mutation:

// Register a new user (creates pending member record)
export const registerUser = mutation({
  args: {
    full_name: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check if user already registered
    const existing = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      .first();
    
    if (existing) throw new Error("User already registered");

    const memberId = await ctx.db.insert("members", {
      full_name: args.full_name,
      phone: args.phone,
      is_active: false, // Not active until approved
      role: "member",
      subscription_amount: 200, // Default
      clerk_user_id: identity.subject,
      approval_status: "pending",
      created_at: Date.now(),
      created_by: identity.subject,
    });

    return memberId;
  },
});
```

- [ ] **Step 2: Add approveUser mutation**

```typescript
// convex/members.ts - Add after registerUser:

// Approve a user (admin only)
export const approveUser = mutation({
  args: {
    memberId: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);

    await ctx.db.patch(args.memberId, {
      approval_status: "approved",
      is_active: true,
      role: args.role,
    });

    await ctx.db.insert("audit_logs", {
      member_id: args.memberId,
      action: "approve_user",
      performed_by: identity.subject,
      details: `تمت الموافقة على العضو وتحديد الدور: ${args.role}`,
      timestamp: Date.now(),
    });

    return args.memberId;
  },
});
```

- [ ] **Step 3: Add rejectUser mutation**

```typescript
// convex/members.ts - Add after approveUser:

// Reject a user (admin only)
export const rejectUser = mutation({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);

    await ctx.db.patch(args.memberId, {
      approval_status: "rejected",
    });

    await ctx.db.insert("audit_logs", {
      member_id: args.memberId,
      action: "reject_user",
      performed_by: identity.subject,
      details: "تم رفض طلب العضوية",
      timestamp: Date.now(),
    });

    return args.memberId;
  },
});
```

- [ ] **Step 4: Add getPendingMembers query**

```typescript
// convex/members.ts - Add after listUsers:

// Get pending members (admin only)
export const getPendingMembers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const pending = await ctx.db
      .query("members")
      .withIndex("by_approval_status", (q) => q.eq("approval_status", "pending"))
      .collect();

    return pending;
  },
});
```

- [ ] **Step 5: Verify mutations compile**

Run: `npx convex dev`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add convex/members.ts
git commit -m "feat: add registerUser, approveUser, rejectUser mutations"
```

---

## Task 3: Complete Admin Enforcement

**Files:**
- Modify: `convex/payments.ts`
- Modify: `convex/auditLogs.ts`

- [ ] **Step 1: Add admin check to togglePayment in payments.ts**

```typescript
// convex/payments.ts - Find togglePayment mutation, add admin check after identity check:

export const togglePayment = mutation({
  args: {
    memberId: v.id("members"),
    year: v.number(),
    month: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // ADD: Admin check
    const member = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      .first();
    if (!member || member.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

    // ... rest of existing code
```

- [ ] **Step 2: Add admin check to batchUpdatePayments in payments.ts**

```typescript
// convex/payments.ts - Find batchUpdatePayments mutation, add admin check:

export const batchUpdatePayments = mutation({
  args: {
    memberId: v.id("members"),
    year: v.number(),
    monthsWithStatus: v.array(v.object({
      month: v.number(),
      status: v.union(v.literal("paid"), v.literal("unpaid")),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // ADD: Admin check
    const member = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      .first();
    if (!member || member.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

    // ... rest of existing code
```

- [ ] **Step 3: Add admin check to getAllAuditLogs in auditLogs.ts**

```typescript
// convex/auditLogs.ts - Find getAllAuditLogs query, add admin check:

export const getAllAuditLogs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // ADD: Admin check
    const member = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", identity.subject))
      .first();
    if (!member || member.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

    const logs = await ctx.db.query("audit_logs").collect();
    return logs;
  },
});
```

- [ ] **Step 4: Verify backend compiles**

Run: `npx convex dev`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add convex/payments.ts convex/auditLogs.ts
git commit -m "feat: complete admin enforcement in payments and auditLogs"
```

---

## Task 4: Update Frontend Types

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add new types**

```typescript
// src/types.ts - Add after existing types:

export type UserRole = 'admin' | 'member';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

// Update Member interface to include new fields:
export interface Member {
  id: string;
  name: string;
  phone: string;
  initials: string;
  branch?: string;
  status: 'active' | 'archived';
  subscriptionAmount: number;
  createdAt: string;
  // NEW FIELDS
  role?: UserRole;
  approvalStatus?: ApprovalStatus;
  clerkUserId?: string;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add UserRole and ApprovalStatus types"
```

---

## Task 5: Create PendingApproval Component

**Files:**
- Create: `src/components/PendingApproval.tsx`

- [ ] **Step 1: Create PendingApproval component**

```tsx
// src/components/PendingApproval.tsx
import React from 'react';
import { useUser, SignOutButton } from '@clerk/react';

export const PendingApproval: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-amber-600 text-3xl">
              hourglass_empty
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2" dir="rtl">
            في انتظار الموافقة
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6" dir="rtl">
            تم تسجيل حسابك بنجاح. يرجى انتظار موافقة المسؤول على طلبك للوصول إلى النظام.
          </p>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">البريد الإلكتروني</p>
            <p className="text-gray-900 font-medium" dir="ltr">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-amber-600 mb-6">
            <span className="material-symbols-outlined">pending</span>
            <span className="font-medium">قيد المراجعة</span>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 text-right mb-6">
            <p className="text-sm text-blue-800" dir="rtl">
              <strong>الخطوات التالية:</strong>
              <br />
              1. سيقوم المسؤول بمراجعة طلبك
              <br />
              2. سيتم إشعارك عند الموافقة
              <br />
              3. يمكنك تسجيل الدخول مرة أخرى للوصول
            </p>
          </div>

          {/* Sign Out */}
          <SignOutButton>
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
              تسجيل الخروج
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify component compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/PendingApproval.tsx
git commit -m "feat: create PendingApproval component"
```

---

## Task 6: Create AdminPanel Component

**Files:**
- Create: `src/components/AdminPanel.tsx`

- [ ] **Step 1: Create AdminPanel component**

```tsx
// src/components/AdminPanel.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface PendingUser {
  _id: Id<'members'>;
  full_name: string;
  phone?: string;
  clerk_user_id?: string;
  created_at: number;
}

export const AdminPanel: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');
  const pendingMembers = useQuery(api.members.getPendingMembers);
  const approveUser = useMutation(api.members.approveUser);
  const rejectUser = useMutation(api.members.rejectUser);
  const [processingId, setProcessingId] = useState<Id<'members'> | null>(null);

  const handleApprove = async (memberId: Id<'members'>) => {
    setProcessingId(memberId);
    try {
      await approveUser({ memberId, role: selectedRole });
    } catch (error) {
      console.error('Error approving user:', error);
      alert('حدث خطأ أثناء الموافقة');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (memberId: Id<'members'>) => {
    if (!confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;
    
    setProcessingId(memberId);
    try {
      await rejectUser({ memberId });
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('حدث خطأ أثناء الرفض');
    } finally {
      setProcessingId(null);
    }
  };

  if (pendingMembers === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" dir="rtl">
          إدارة طلبات العضوية
        </h1>
        <p className="text-gray-600" dir="rtl">
          مراجعة والموافقة على طلبات الانضمام الجديدة
        </p>
      </div>

      {pendingMembers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <span className="material-symbols-outlined text-gray-400 text-5xl mb-4">
            check_circle
          </span>
          <p className="text-gray-600">لا توجد طلبات معلقة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingMembers.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900" dir="rtl">
                    {user.full_name}
                  </h3>
                  {user.phone && (
                    <p className="text-gray-600 text-sm mt-1" dir="ltr">
                      {user.phone}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">
                    تم التسجيل: {new Date(user.created_at).toLocaleDateString('ar-JO')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Role Selector */}
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'member')}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="member">عضو</option>
                    <option value="admin">مسؤول</option>
                  </select>

                  {/* Approve Button */}
                  <button
                    onClick={() => handleApprove(user._id)}
                    disabled={processingId === user._id}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {processingId === user._id ? 'جاري...' : 'موافقة'}
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleReject(user._id)}
                    disabled={processingId === user._id}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    رفض
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify component compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/AdminPanel.tsx
git commit -m "feat: create AdminPanel component"
```

---

## Task 7: Update App.tsx with Approval Status Gating

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import new components and hooks**

```tsx
// src/App.tsx - Update imports:
import React, { useState } from 'react';
import { useUser } from '@clerk/react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FundProvider, useFund } from './context/FundContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { PaymentMatrixView } from './components/PaymentMatrixView';
import { MembersView } from './components/MembersView';
import { HistoryView } from './components/HistoryView';
import { AddMemberModal } from './components/modals/AddMemberModal';
import { NewPaymentModal } from './components/modals/NewPaymentModal';
import { LandingPage } from './components/LandingPage';
import { PendingApproval } from './components/PendingApproval';
import { AdminPanel } from './components/AdminPanel';
import { Member } from './types';
```

- [ ] **Step 2: Update MainContent to check approval status**

```tsx
// src/App.tsx - Replace MainContent component:

const MainContent: React.FC = () => {
  const { activeTab } = useFund();
  const currentMember = useQuery(api.members.getCurrentMember);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  // Loading state
  if (currentMember === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not registered yet
  if (currentMember === null) {
    return <PendingApproval />;
  }

  // Check approval status
  if (currentMember.approval_status === 'pending') {
    return <PendingApproval />;
  }

  if (currentMember.approval_status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
            block
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تم رفض طلبك</h1>
          <p className="text-gray-600">تم رفض طلب العضوية الخاص بك</p>
        </div>
      </div>
    );
  }

  const isAdmin = currentMember.role === 'admin';

  const handleEditMember = (member: Member) => {
    setMemberToEdit(member);
    setIsAddMemberOpen(true);
  };

  const handleOpenAddMember = () => {
    setMemberToEdit(null);
    setIsAddMemberOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenNewPayment={() => setIsNewPaymentOpen(true)} isAdmin={isAdmin} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8" key={activeTab}>
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'payments' && (
              <PaymentMatrixView onOpenNewPayment={() => setIsNewPaymentOpen(true)} isAdmin={isAdmin} />
            )}
            {activeTab === 'members' && (
              <MembersView
                onOpenAddMember={handleOpenAddMember}
                onEditMember={handleEditMember}
                isAdmin={isAdmin}
              />
            )}
            {activeTab === 'history' && <HistoryView />}
            {activeTab === 'admin' && isAdmin && <AdminPanel />}
        </main>
      </div>

      <BottomNav isAdmin={isAdmin} />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        memberToEdit={memberToEdit}
      />

      <NewPaymentModal
        isOpen={isNewPaymentOpen}
        onClose={() => setIsNewPaymentOpen(false)}
      />
    </div>
  );
};
```

- [ ] **Step 3: Update App component to use approval gating**

```tsx
// src/App.tsx - Replace App component:

export default function App() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <FundProvider>
        <main className="overflow-x-hidden w-full max-w-full">
          <LandingPage />
        </main>
      </FundProvider>
    );
  }

  return (
    <FundProvider>
      <main className="overflow-x-hidden w-full max-w-full">
        <MainContent />
      </main>
    </FundProvider>
  );
}
```

- [ ] **Step 4: Verify component compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add approval status gating in App.tsx"
```

---

## Task 8: Update Header with Admin Link

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Add isAdmin prop and admin link**

```tsx
// src/components/Header.tsx - Update interface and add admin link:

interface HeaderProps {
  onOpenNewPayment: () => void;
  isAdmin: boolean; // ADD THIS
}

// In the component, add admin link in the header (before UserButton):
{isAdmin && (
  <button
    onClick={() => {/* Navigate to admin panel */}}
    className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-2 rounded-lg text-sm font-medium"
  >
    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
    <span>الإدارة</span>
  </button>
)}
```

- [ ] **Step 2: Verify component compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add admin link to Header"
```

---

## Task 9: Add Role-Based UI to PaymentMatrixView

**Files:**
- Modify: `src/components/PaymentMatrixView.tsx`

- [ ] **Step 1: Add isAdmin prop and conditionally render edit buttons**

```tsx
// src/components/PaymentMatrixView.tsx - Update interface:

interface PaymentMatrixViewProps {
  onOpenNewPayment: () => void;
  isAdmin: boolean; // ADD THIS
}

// In the component, conditionally render edit buttons:
{isAdmin && (
  <button onClick={onOpenNewPayment}>
    <span className="material-symbols-outlined">add</span>
  </button>
)}
```

- [ ] **Step 2: Verify component compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/PaymentMatrixView.tsx
git commit -m "feat: add role-based UI to PaymentMatrixView"
```

---

## Task 10: Add Role-Based UI to MembersView

**Files:**
- Modify: `src/components/MembersView.tsx`

- [ ] **Step 1: Add isAdmin prop and conditionally render add/edit buttons**

```tsx
// src/components/MembersView.tsx - Update interface:

interface MembersViewProps {
  onOpenAddMember: () => void;
  onEditMember: (member: Member) => void;
  isAdmin: boolean; // ADD THIS
}

// In the component, conditionally render add button:
{isAdmin && (
  <button onClick={onOpenAddMember}>
    <span className="material-symbols-outlined">person_add</span>
  </button>
)}

// Conditionally render edit button per member:
{isAdmin && (
  <button onClick={() => onEditMember(member)}>
    <span className="material-symbols-outlined">edit</span>
  </button>
)}
```

- [ ] **Step 2: Verify component compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/MembersView.tsx
git commit -m "feat: add role-based UI to MembersView"
```

---

## Task 11: Update BottomNav with Admin Tab

**Files:**
- Modify: `src/components/BottomNav.tsx`

- [ ] **Step 1: Add isAdmin prop and admin tab**

```tsx
// src/components/BottomNav.tsx - Update interface:

interface BottomNavProps {
  isAdmin: boolean; // ADD THIS
}

// In the component, add admin tab (only visible to admins):
{isAdmin && (
  <button onClick={() => setActiveTab('admin')}>
    <span className="material-symbols-outlined">admin_panel_settings</span>
    <span>الإدارة</span>
  </button>
)}
```

- [ ] **Step 2: Verify component compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/BottomNav.tsx
git commit -m "feat: add admin tab to BottomNav"
```

---

## Task 12: Update Sidebar with Admin Tab

**Files:**
- Modify: `src/components/Sidebar.tsx`

- [ ] **Step 1: Add isAdmin prop and admin tab**

```tsx
// src/components/Sidebar.tsx - Update interface:

interface SidebarProps {
  isAdmin: boolean; // ADD THIS
}

// In the component, add admin tab (only visible to admins):
{isAdmin && (
  <button onClick={() => setActiveTab('admin')}>
    <span className="material-symbols-outlined">admin_panel_settings</span>
    <span>لوحة الإدارة</span>
  </button>
)}
```

- [ ] **Step 2: Verify component compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidebar.tsx
git commit -m "feat: add admin tab to Sidebar"
```

---

## Task 13: Update ActiveTab Type

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add 'admin' to ActiveTab type**

```typescript
// src/types.ts - Update ActiveTab:

export type ActiveTab = 'dashboard' | 'payments' | 'members' | 'history' | 'admin';
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add admin to ActiveTab type"
```

---

## Task 14: Create Data Migration Script

**Files:**
- Create: `convex/migrateFromLocalStorage.ts`

- [ ] **Step 1: Create migration mutation**

```typescript
// convex/migrateFromLocalStorage.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Migration script to import localStorage data into Convex
// Run this ONCE after deploying the new schema
export const migrateFromLocalStorage = mutation({
  args: {
    members: v.array(v.object({
      full_name: v.string(),
      phone: v.optional(v.string()),
      branch: v.optional(v.string()),
      subscription_amount: v.number(),
      is_active: v.boolean(),
    })),
    adminClerkUserId: v.string(), // Clerk user ID of the admin
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Only allow migration by the specified admin
    if (identity.subject !== args.adminClerkUserId) {
      throw new Error("Only the designated admin can run migration");
    }

    const results = [];

    for (const member of args.members) {
      const memberId = await ctx.db.insert("members", {
        ...member,
        role: "member",
        approval_status: "approved",
        clerk_user_id: undefined,
        created_at: Date.now(),
        created_by: identity.subject,
      });
      results.push(memberId);
    }

    // Set the admin user
    const adminMember = await ctx.db
      .query("members")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerk_user_id", args.adminClerkUserId))
      .first();

    if (adminMember) {
      await ctx.db.patch(adminMember._id, {
        role: "admin",
        approval_status: "approved",
      });
    }

    return { migrated: results.length, memberIds: results };
  },
});
```

- [ ] **Step 2: Verify migration script compiles**

Run: `npx convex dev`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add convex/migrateFromLocalStorage.ts
git commit -m "feat: add data migration script"
```

---

## Task 15: Final Verification

- [ ] **Step 1: Run full typecheck**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Build project**

Run: `npm run build`
Expected: Successful build

- [ ] **Step 4: Start dev server and test**

Run: `npm run dev`
Test:
1. Sign up with a new account
2. Should see PendingApproval screen
3. Sign in as admin
4. Navigate to AdminPanel
5. Approve the new user
6. Sign in as new user
7. Should see read-only view (no edit buttons)

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete RBAC implementation with admin approval"
```

---

## Summary

| Task | Files | Description |
|------|-------|-------------|
| 1 | `convex/schema.ts` | Add approval_status field |
| 2 | `convex/members.ts` | Add registerUser, approveUser, rejectUser |
| 3 | `convex/payments.ts`, `convex/auditLogs.ts` | Complete admin enforcement |
| 4 | `src/types.ts` | Add new types |
| 5 | `src/components/PendingApproval.tsx` | Create waiting screen |
| 6 | `src/components/AdminPanel.tsx` | Create admin panel |
| 7 | `src/App.tsx` | Add approval gating |
| 8 | `src/components/Header.tsx` | Add admin link |
| 9 | `src/components/PaymentMatrixView.tsx` | Role-based UI |
| 10 | `src/components/MembersView.tsx` | Role-based UI |
| 11 | `src/components/BottomNav.tsx` | Add admin tab |
| 12 | `src/components/Sidebar.tsx` | Add admin tab |
| 13 | `src/types.ts` | Update ActiveTab type |
| 14 | `convex/migrateFromLocalStorage.ts` | Migration script |
| 15 | - | Final verification |

**Total Files:** 12 modified/created
**Estimated Time:** 2-3 hours
