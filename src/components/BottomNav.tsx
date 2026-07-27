import React from 'react';
import { useFund } from '../context/FundContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useFund();

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: 'dashboard' },
    { id: 'payments', label: 'المدفوعات', icon: 'account_balance_wallet' },
    { id: 'members', label: 'الأعضاء', icon: 'group' },
    { id: 'history', label: 'السجل', icon: 'history' },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white rounded-2xl border border-fund-border/40 shadow-lg shadow-black/8 px-2 py-2">
        <div className="flex flex-row-reverse justify-around items-center">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-fund-green text-white font-semibold shadow-lg shadow-fund-green/20 scale-105'
                    : 'text-fund-muted hover:bg-fund-accent active:scale-95'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'filled' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] mt-0.5 tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
