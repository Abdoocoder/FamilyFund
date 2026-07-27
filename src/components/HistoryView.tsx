import React, { useState, useRef, useEffect } from 'react';
import { useFund } from '../context/FundContext';
import { ARABIC_MONTHS } from '../data/initialMembers';
import { MonthNumber } from '../types';
import gsap from 'gsap';

export const HistoryView: React.FC = () => {
  const { members, payments, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, setActiveTab } = useFund();

  const [historyYear, setHistoryYear] = useState<number>(new Date().getFullYear());
  const [historyMonth, setHistoryMonth] = useState<MonthNumber>((new Date().getMonth() + 1) as MonthNumber);

  const headerRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  const myMember = members[0] || { id: 'mem-1', name: 'أحمد عبدالله', phone: '+966 50 123 4567' };

  const myPayments = payments.filter(p => p.memberId === myMember.id && p.year === historyYear);
  const myPaidCount = myPayments.filter(p => p.status === 'paid').length;
  const myPendingCount = myPayments.filter(p => p.status === 'pending').length;
  const myRemainingCount = 12 - myPaidCount - myPendingCount;
  const myTotalPaidJOD = myPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 200), 0);

  const activeMembers = members.filter(m => m.status === 'active');
  const totalFundTarget = activeMembers.reduce((sum, m) => sum + m.subscriptionAmount * 12, 0);
  const totalFundCollected = payments
    .filter(p => p.year === historyYear && p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 200), 0);
  const fundHealthPct = totalFundTarget > 0 ? Math.round((totalFundCollected / totalFundTarget) * 100) : 0;

  const memberMonthStatusList = activeMembers.map(member => {
    const record = payments.find(p => p.memberId === member.id && p.year === historyYear && p.month === historyMonth);
    return {
      member,
      status: record?.status || 'unpaid',
      amount: record?.amount || member.subscriptionAmount || 200,
    };
  });

  // GSAP entrance — fade-in with subtle scale for the bento layout
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.5,
        ease: 'power3.out',
      });

      if (bentoRef.current) {
        gsap.from(bentoRef.current.children, {
          opacity: 0,
          scale: 0.97,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.1,
        });
      }
    });
    return () => ctx.revert();
  }, [historyYear]);

  return (
    <div className="space-y-5 pb-24 md:pb-8">
      {/* Header */}
      <section ref={headerRef} className="surface-elevated p-6 rounded-2xl flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-fund-text tracking-tight" style={{ textWrap: 'balance' }}>سجل المدفوعات</h2>
            <p className="text-sm md:text-base text-fund-muted mt-1.5 tracking-wide">
              متابعة مدفوعاتك الشخصية وحالة الصندوق العامة لعام {historyYear}.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-fund-accent/50 p-1 rounded-xl">
            {[2024, 2025, 2026].map(yr => (
              <button
                key={yr}
                onClick={() => {
                  setHistoryYear(yr);
                  setSelectedYear(yr);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-fund-green focus-visible:outline-none ${
                  historyYear === yr
                    ? 'bg-fund-green text-white shadow-sm shadow-fund-green/20'
                    : 'text-fund-muted hover:bg-white/60'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div ref={bentoRef} className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Personal Summary (Large) */}
        <div className="md:col-span-8 surface-elevated rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm text-fund-muted font-medium tracking-wide mb-1">مدفوعاتك هذا العام</span>
              <span className="text-3xl md:text-4xl font-bold text-fund-green tabular-nums tracking-tight">
                {myTotalPaidJOD.toLocaleString('ar-JO')}{' '}
                <span className="text-sm text-fund-muted font-normal">د.أ</span>
              </span>
            </div>

            <div className="bg-status-paid-bg text-status-paid px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>منتظم</span>
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="flex flex-col gap-2 mt-6">
            <div className="flex justify-between text-[11px] text-fund-muted px-1 font-medium tracking-wide">
              <span>يناير</span>
              <span>مارس</span>
              <span>يونيو</span>
              <span>سبتمبر</span>
              <span>ديسمبر</span>
            </div>

            <div className="h-3 w-full bg-fund-accent rounded-full overflow-hidden flex shadow-inner">
              <div
                className="h-full bg-fund-green transition-all duration-1000 ease-out"
                style={{ width: `${(myPaidCount / 12) * 100}%` }}
              />
              {myPendingCount > 0 && (
                <div
                  className="h-full bg-status-pending-bg transition-all duration-1000 ease-out"
                  style={{ width: `${(myPendingCount / 12) * 100}%` }}
                />
              )}
            </div>

            <div className="flex justify-between text-[11px] text-fund-muted px-1 mt-1">
              <span className="font-bold text-fund-green">تم الدفع: {myPaidCount} أشهر</span>
                {myPendingCount > 0 && <span className="font-bold text-status-pending">قيد الانتظار: {myPendingCount} شهر</span>}
              <span className="text-fund-muted/60">المتبقي: {myRemainingCount} أشهر</span>
            </div>
          </div>
        </div>

        {/* Fund Health KPI (Small) */}
        <div className="md:col-span-4 surface-elevated rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-sm text-fund-muted flex items-center gap-1.5 font-medium tracking-wide">
              <span className="material-symbols-outlined text-fund-green text-lg">account_balance</span>
              إجمالي التحصيل
            </span>
            <span className="text-2xl md:text-3xl font-bold text-fund-text tabular-nums tracking-tight">
              {totalFundCollected.toLocaleString('ar-JO')}{' '}
              <span className="text-sm font-normal text-fund-muted">د.أ</span>
            </span>
          </div>

          <div className="bg-fund-accent/40 p-3 rounded-xl flex items-center justify-between border border-fund-border/30">
            <div className="flex flex-col">
              <span className="text-[11px] text-fund-muted tracking-wide">الهدف السنوي</span>
              <span className="text-sm font-bold text-fund-green tabular-nums">{totalFundTarget.toLocaleString('ar-JO')} د.أ</span>
            </div>

            <div className="w-12 h-12 rounded-full border-[3px] border-fund-green border-t-transparent flex items-center justify-center relative bg-white shadow-sm">
              <span className="text-[11px] font-bold text-fund-green tabular-nums">{fundHealthPct}%</span>
            </div>
          </div>
        </div>

        {/* Global Member Status (Full Width) */}
        <div className="md:col-span-12 surface-elevated rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-fund-accent/50 border-b border-fund-border/40 flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-lg font-bold text-fund-text tracking-tight" style={{ textWrap: 'balance' }}>
              حالة دفع الأعضاء ({ARABIC_MONTHS[historyMonth - 1]} {historyYear})
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-fund-muted tracking-wide">اختر الشهر:</span>
              <div className="relative">
                <select
                  value={historyMonth}
                  onChange={(e) => {
                    const m = Number(e.target.value) as MonthNumber;
                    setHistoryMonth(m);
                    setSelectedMonth(m);
                  }}
                  className="bg-white border border-fund-border/60 text-fund-text text-xs font-bold rounded-xl pl-8 pr-3 py-1.5 appearance-none focus:outline-none focus:ring-2 focus:ring-fund-green/20 cursor-pointer shadow-sm"
                >
                  {ARABIC_MONTHS.map((mName, idx) => (
                    <option key={mName} value={idx + 1}>
                      {mName} {historyYear}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-2 top-1.5 text-fund-muted text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full divide-y divide-fund-border/30">
            <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-2.5 bg-fund-accent/30 text-xs font-bold text-fund-muted">
              <div className="col-span-2 tracking-wide">العضو</div>
              <div className="text-center">حالة الدفع</div>
              <div className="text-left font-mono">المبلغ (د.أ)</div>
            </div>

            {memberMonthStatusList.map(({ member, status, amount }) => (
              <div
                key={member.id}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-3.5 items-center hover:bg-fund-accent/20 transition-colors duration-200 group"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    status === 'paid' ? 'bg-fund-green text-white' : (status === 'pending' ? 'bg-status-pending-bg text-status-pending' : 'bg-status-danger-surface text-status-danger')
                  }`}>
                    {member.initials || member.name.charAt(0)}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-fund-text tracking-wide">{member.name}</span>
                    <span className="text-xs text-fund-muted md:hidden">{amount} د.أ</span>
                  </div>
                </div>

                <div className="text-left md:text-center">
                  {status === 'paid' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-status-paid-bg text-status-paid text-xs font-bold">
                      مسدد
                    </span>
                  )}
                  {status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-status-pending-bg text-status-pending text-xs font-bold">
                      قيد المراجعة
                    </span>
                  )}
                  {status === 'unpaid' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-status-danger-bg text-status-danger text-xs font-bold">
                      غير مسدد
                    </span>
                  )}
                </div>

                <div className="hidden md:block text-left font-mono text-sm font-bold text-fund-text tabular-nums">
                  {amount.toLocaleString('ar-JO')}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-3.5 bg-fund-accent/30 border-t border-fund-border/40 flex justify-center">
            <button
              onClick={() => setActiveTab('payments')}
              className="text-fund-green text-xs font-bold hover:bg-fund-accent px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:gap-2.5"
            >
              <span>فتح جدول المدفوعات الكامل</span>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
