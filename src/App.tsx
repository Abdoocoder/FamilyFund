import React, { useState } from 'react';
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
import { Member } from './types';

const MainContent: React.FC = () => {
  const { activeTab } = useFund();

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

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
      <Header onOpenNewPayment={() => setIsNewPaymentOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8" key={activeTab}>
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'payments' && (
              <PaymentMatrixView onOpenNewPayment={() => setIsNewPaymentOpen(true)} />
            )}
            {activeTab === 'members' && (
              <MembersView
                onOpenAddMember={handleOpenAddMember}
                onEditMember={handleEditMember}
              />
            )}
            {activeTab === 'history' && <HistoryView />}
        </main>
      </div>

      <BottomNav />

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
  return (
    <FundProvider>
      <main className="overflow-x-hidden w-full max-w-full">
        <MainContent />
      </main>
    </FundProvider>
  );
}
