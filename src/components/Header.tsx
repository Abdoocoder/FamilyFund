import React from 'react';
import { useFund } from '../context/FundContext';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/react';

interface HeaderProps {
  onOpenNewPayment?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewPayment }) => {
  const { auditLogs } = useFund();

  return (
    <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-40 w-full transition-colors">
      <div className="flex flex-row-reverse justify-between items-center px-4 md:px-12 py-3 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c2c9bb] shrink-0 bg-[#e5eeff] flex items-center justify-center">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdqjGsIGkDUsBb_NNf0QkvJh0JKTf9xv3cVTDcM_Ahhdi8NkvZyT04u1Mz6GWMNEGjLwkI_cnCs4-sUF3OCXpeb1agnJXkzzpHTMwj3sW5ur9qZ7o5SdQoDIJVNsNINRososSzRb17-RrRHxW6vBM9MojC8n34r-iw8a8Efp6jpTrvegeLn7td-ggIg4yDv8688eDP3FSkjXc6J8T8rgTeRHETxYYtUMcEWdv4DmZQxhcLX5wZ-70OE0LDBJzjSX740ce5xE2lCL8"
              onError={(e) => {
                // Fallback avatar if external image is restricted
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="material-symbols-outlined text-[#154212]">person</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl text-[#154212] font-bold">صندوق العائلة</h1>
            <p className="text-xs text-[#42493e] hidden sm:block">نظام المحاسبة وإدارة الاشتراكات</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenNewPayment && (
            <button
              onClick={onOpenNewPayment}
              className="hidden sm:flex items-center gap-1.5 bg-[#154212] hover:bg-[#2d5a27] text-white text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>دفعة جديدة</span>
            </button>
          )}

          <div className="relative group">
            <button className="text-[#154212] hover:bg-[#eff4ff] p-2 rounded-full transition-colors relative flex items-center justify-center">
              <span className="material-symbols-outlined">notifications</span>
              {auditLogs.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-[#154212] hover:bg-[#2d5a27] text-white text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors">
                تسجيل الدخول
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};
