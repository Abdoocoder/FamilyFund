import React from 'react';
import { useFund } from '../context/FundContext';
import { useUser, SignInButton, UserButton } from '@clerk/react';

interface HeaderProps {
  onOpenNewPayment?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewPayment }) => {
  const { auditLogs } = useFund();
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/88 border-b border-fund-border/40">
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
          {onOpenNewPayment && (
            <button
              onClick={onOpenNewPayment}
              className="hidden sm:flex items-center gap-2 bg-fund-green hover:bg-fund-green-light text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-fund-green/10 active:scale-[0.97]"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>دفعة جديدة</span>
            </button>
          )}

          <div className="relative group">
            <button className="text-fund-green hover:bg-fund-accent p-2.5 rounded-xl transition-all duration-300 relative flex items-center justify-center hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
              {auditLogs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-status-danger rounded-full border-2 border-white animate-pulse" />
              )}
            </button>
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
