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

const MainContent: React.FC = () => {
  const { activeTab } = useFund();
  const currentMember = useQuery(api.members.getCurrentMember);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  // Loading state — skeleton matching app layout
  if (currentMember === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="h-16 bg-white border-b border-border/50" />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <aside className="hidden md:flex flex-col w-64 bg-white border-l border-border/40 p-4 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-11 rounded-xl bg-primary-subtle/60 animate-pulse" />
            ))}
          </aside>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-64 rounded-lg bg-primary-subtle/60" />
              <div className="h-4 w-48 rounded bg-primary-subtle/40" />
              <div className="grid grid-cols-3 gap-4 mt-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-primary-subtle/60" />
                ))}
              </div>
              <div className="h-64 rounded-2xl bg-primary-subtle/40 mt-4" />
            </div>
          </main>
        </div>
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
        <div className="text-center max-w-sm">
          <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
            block
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تم رفض طلبك</h1>
          <p className="text-gray-600 mb-4">تم رفض طلب العضوية الخاص بك</p>
          <div className="bg-primary-subtle rounded-xl p-4 text-right">
            <p className="text-sm text-foreground/80">
              يمكنك التواصل مع الإدارة لمزيد من التفاصيل
            </p>
          </div>
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
        <Sidebar isAdmin={isAdmin} />

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
