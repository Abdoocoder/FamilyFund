import React from 'react';
import { useFund } from '../context/FundContext';
import { ActiveTab } from '../types';

interface SidebarProps {
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isAdmin }) => {
  const { activeTab, setActiveTab, members } = useFund();

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: 'dashboard' },
    { id: 'payments', label: 'المدفوعات', icon: 'account_balance_wallet' },
    { id: 'members', label: 'الأعضاء', icon: 'group' },
    { id: 'history', label: 'السجل', icon: 'history' },
  ];

  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-elevated border-l border-border/40 h-screen sticky top-0 shrink-0 z-30">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm shadow-primary/10">
            <span className="material-symbols-outlined text-white text-lg">family_restroom</span>
          </div>
          <div>
            <p className="text-lg text-primary font-bold tracking-tight leading-tight">صندوق العائلة</p>
            <p className="text-[10px] text-muted-foreground tracking-wide">الإدارة المالية والاشتراكات</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3">
        <ul className="space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/15'
                      : 'text-muted-foreground hover:bg-primary-subtle hover:text-foreground'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                  {item.id === 'members' && (
                    <span className={`mr-auto px-2.5 py-0.5 text-[11px] rounded-full font-bold tabular-nums ${
                      isActive ? 'bg-surface-elevated/20 text-white' : 'bg-primary-subtle text-primary'
                    }`}>
                      {activeMembersCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}

          {isAdmin && (
            <li>
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'admin'
                    ? 'bg-primary text-white shadow-lg shadow-primary/15'
                    : 'text-muted-foreground hover:bg-primary-subtle hover:text-foreground'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${activeTab === 'admin' ? 'fill' : ''}`}>
                  admin_panel_settings
                </span>
                <span className="tracking-wide">لوحة الإدارة</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary-subtle/50 transition-colors duration-300 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-primary/10 text-sm">
            أ.ع
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-foreground truncate tracking-wide">سعيد محمود أبوكف</p>
            <p className="text-[11px] text-muted-foreground">مدير الصندوق / المحاسب</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
