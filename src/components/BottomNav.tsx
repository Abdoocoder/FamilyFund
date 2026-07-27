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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-[#e2e8f0] shadow-[0px_-4px_12px_rgba(45,90,39,0.05)] z-50 rounded-t-xl py-2 px-2">
      <div className="flex flex-row-reverse justify-around items-center">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#2d5a27] text-white font-semibold scale-100 shadow-xs'
                  : 'text-[#42493e] hover:bg-[#eff4ff]'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-xs mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
