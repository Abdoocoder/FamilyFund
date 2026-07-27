import React, { useState, useRef, useEffect } from 'react';
import { useFund } from '../context/FundContext';
import { useUser, SignInButton, UserButton } from '@clerk/react';

interface HeaderProps {
  onOpenNewPayment?: () => void;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewPayment, isAdmin }) => {
  const { auditLogs, setActiveTab } = useFund();
  const { isSignedIn } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const recentLogs = auditLogs.slice(0, 5);
  const unreadCount = auditLogs.filter(log => {
    const logTime = new Date(log.timestamp).getTime();
    return Date.now() - logTime < 3600000;
  }).length;

  const formatRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-fund-border/40">
      <div className="flex flex-row-reverse justify-between items-center px-4 md:px-12 py-3 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/40 shrink-0 bg-gradient-to-br from-fund-green to-fund-green-light flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-xl">family_restroom</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl text-fund-green font-bold tracking-tight leading-tight">
              صندوق العائلة
            </h1>
            <p className="text-[11px] text-fund-muted hidden sm:block tracking-wide">
              نظام المحاسبة وإدارة الاشتراكات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-2 rounded-lg text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              <span>الإدارة</span>
            </button>
          )}

          {onOpenNewPayment && (
            <button
              onClick={onOpenNewPayment}
              className="hidden sm:flex items-center gap-2 bg-fund-green hover:bg-fund-green-light text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-fund-green/10 active:scale-[0.97]"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>دفعة جديدة</span>
            </button>
          )}

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`الإشعارات${unreadCount > 0 ? `، ${unreadCount} جديدة` : ''}`}
              className="text-fund-green hover:bg-fund-accent p-2.5 rounded-xl transition-all duration-300 relative flex items-center justify-center active:scale-95"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-status-danger text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-fund-border/40 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-fund-border/40 flex justify-between items-center">
                  <span className="text-sm font-bold text-fund-text">آخر العمليات</span>
                  {auditLogs.length > 0 && (
                    <button
                      onClick={() => { setShowNotifications(false); setActiveTab('history'); }}
                      className="text-xs font-bold text-fund-green hover:bg-fund-accent px-2 py-1 rounded-lg transition-colors"
                    >
                      عرض الكل
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {recentLogs.length === 0 ? (
                    <div className="px-4 py-8 text-center text-fund-muted text-sm">لا توجد عمليات مسجلة</div>
                  ) : (
                    recentLogs.map((log) => (
                      <div key={log.id} className="px-4 py-3 border-b border-fund-border/20 last:border-b-0 hover:bg-fund-accent/30 transition-colors">
                        <p className="text-xs font-bold text-fund-text">{log.action}</p>
                        <p className="text-[11px] text-fund-muted mt-0.5 truncate">{log.details}</p>
                        <p className="text-[10px] text-fund-muted/80 mt-1">{formatRelativeTime(log.timestamp)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {isSignedIn ? (
            <div className="rounded-xl overflow-hidden border border-white/30 shadow-sm">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-fund-green hover:bg-fund-green-light text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.97]">
                تسجيل الدخول
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
};
