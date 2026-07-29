import React from 'react';
import { useFund } from '../context/FundContext';
import { ActiveTab } from '../types';

interface BottomNavProps {
  isAdmin: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isAdmin }) => {
  const { activeTab, setActiveTab } = useFund();

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: 'dashboard' },
    { id: 'payments', label: 'المدفوعات', icon: 'account_balance_wallet' },
    { id: 'members', label: 'الأعضاء', icon: 'group' },
    { id: 'history', label: 'السجل', icon: 'history' },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm border border-border/30 shadow-lg shadow-black/5 rounded-2xl px-3 py-2">
        <div className="flex flex-row-reverse justify-around items-center">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white font-semibold shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:bg-primary-subtle'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] mt-0.5 tracking-wide">{item.label}</span>
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeTab === 'admin'
                    ? 'bg-primary text-white font-semibold shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:bg-primary-subtle'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${activeTab === 'admin' ? 'fill' : ''}`}>
                admin_panel_settings
              </span>
              <span className="text-[10px] mt-0.5 tracking-wide">الإدارة</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
