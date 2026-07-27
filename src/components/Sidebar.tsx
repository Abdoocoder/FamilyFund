import React from 'react';
import { useFund } from '../context/FundContext';
import { ActiveTab } from '../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, members } = useFund();

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: 'dashboard' },
    { id: 'payments', label: 'المدفوعات', icon: 'account_balance_wallet' },
    { id: 'members', label: 'الأعضاء', icon: 'group' },
    { id: 'history', label: 'السجل', icon: 'history' },
  ];

  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-l border-[#e2e8f0] h-screen sticky top-0 shrink-0 shadow-[4px_0_12px_rgba(45,90,39,0.03)] z-30">
      <div className="p-6 border-b border-[#e2e8f0]">
        <h1 className="text-2xl text-[#154212] font-bold">صندوق العائلة</h1>
        <p className="text-xs text-[#42493e] mt-1">الإدارة المالية والاشتراكات</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1.5">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2d5a27] text-white shadow-xs'
                      : 'text-[#42493e] hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.id === 'members' && (
                    <span className={`mr-auto px-2 py-0.5 text-xs rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#e5eeff] text-[#154212]'
                    }`}>
                      {activeMembersCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-[#e2e8f0] bg-[#f8f9ff]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2d5a27] text-white flex items-center justify-center font-bold shrink-0">
            أ.ع
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[#0b1c30] truncate">أحمد العبدالله</p>
            <p className="text-xs text-[#42493e]">مدير الصندوق / المحاسب</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
