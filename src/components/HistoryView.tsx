import React, { useState } from 'react';
import { useFund } from '../context/FundContext';
import { ARABIC_MONTHS } from '../data/initialMembers';
import { MonthNumber } from '../types';

export const HistoryView: React.FC = () => {
  const { members, payments, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, setActiveTab } = useFund();

  const [historyYear, setHistoryYear] = useState<number>(2024);
  const [historyMonth, setHistoryMonth] = useState<MonthNumber>(7); // Default July (يوليو)

  // Current logged in member representation (e.g. Ahmed Abdullah or Treasurer)
  const myMember = members[0] || { id: 'mem-1', name: 'أحمد عبدالله', phone: '+966 50 123 4567' };

  // Calculate my payments for historyYear
  const myPayments = payments.filter(p => p.memberId === myMember.id && p.year === historyYear);
  const myPaidCount = myPayments.filter(p => p.status === 'paid').length;
  const myPendingCount = myPayments.filter(p => p.status === 'pending').length;
  const myRemainingCount = 12 - myPaidCount - myPendingCount;
  const myTotalPaidJOD = myPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 200), 0);

  // Fund health stats for historyYear
  const activeMembers = members.filter(m => m.status === 'active');
  const totalFundTarget = activeMembers.length * 12 * 200; // e.g. 120,000 JOD
  const totalFundCollected = payments
    .filter(p => p.year === historyYear && p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 200), 0);
  const fundHealthPct = totalFundTarget > 0 ? Math.round((totalFundCollected / totalFundTarget) * 100) : 0;

  // Global member payment status list for selected month
  const memberMonthStatusList = activeMembers.map(member => {
    const record = payments.find(p => p.memberId === member.id && p.year === historyYear && p.month === historyMonth);
    return {
      member,
      status: record?.status || 'unpaid',
      amount: record?.amount || member.subscriptionAmount || 200,
    };
  });

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header Section */}
      <section className="flex flex-col gap-1 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0b1c30]">سجل المدفوعات</h2>
            <p className="text-sm md:text-base text-[#42493e] mt-1">
              متابعة مدفوعاتك الشخصية وحالة الصندوق العامة لعام {historyYear}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[2024, 2025, 2026].map(yr => (
              <button
                key={yr}
                onClick={() => {
                  setHistoryYear(yr);
                  setSelectedYear(yr);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  historyYear === yr ? 'bg-[#154212] text-white' : 'bg-[#eff4ff] text-[#42493e] hover:bg-[#e5eeff]'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Personal Summary Card (Bento Item 1 - Large) */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-[#e2e8f0] p-6 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm text-[#42493e] font-medium mb-1">مدفوعاتك هذا العام</span>
              <span className="text-3xl font-bold text-[#154212]">
                {myTotalPaidJOD.toLocaleString('ar-JO')} <span className="text-base text-[#42493e] font-normal">د.أ</span>
              </span>
            </div>

            <div className="bg-[#d1fae5] text-[#065f46] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>منتظم</span>
            </div>
          </div>

          {/* Monthly Progress Bar */}
          <div className="flex flex-col gap-2 mt-6">
            <div className="flex justify-between text-xs text-[#42493e] px-1 font-medium">
              <span>يناير</span>
              <span>مارس</span>
              <span>يونيو</span>
              <span>سبتمبر</span>
              <span>ديسمبر</span>
            </div>

            {/* Visual Bar Split */}
            <div className="h-3.5 w-full bg-[#e5eeff] rounded-full overflow-hidden flex shadow-inner">
              {/* Paid Months (Green) */}
              <div
                className="h-full bg-[#154212] transition-all duration-500 border-r border-white"
                style={{ width: `${(myPaidCount / 12) * 100}%` }}
              ></div>

              {/* Pending Months (Yellow) */}
              {myPendingCount > 0 && (
                <div
                  className="h-full bg-[#fef3c7] transition-all duration-500 border-r border-white"
                  style={{ width: `${(myPendingCount / 12) * 100}%` }}
                ></div>
              )}

              {/* Remaining Months (Empty) */}
              <div className="h-full bg-transparent flex-1"></div>
            </div>

            <div className="flex justify-between text-xs text-[#42493e] px-1 mt-1">
              <span className="font-semibold text-[#154212]">تم الدفع: {myPaidCount} أشهر</span>
              {myPendingCount > 0 && <span className="font-semibold text-[#92400e]">قيد الانتظار: {myPendingCount} شهر</span>}
              <span className="text-[#72796e]">المتبقي: {myRemainingCount} أشهر</span>
            </div>
          </div>
        </div>

        {/* Fund Health KPI Card (Bento Item 2 - Small) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-[#e2e8f0] p-6 flex flex-col justify-between shadow-xs">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-sm text-[#42493e] flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[#154212]">account_balance</span>
              إجمالي التحصيل
            </span>
            <span className="text-2xl md:text-3xl font-bold text-[#0b1c30]">
              {totalFundCollected.toLocaleString('ar-JO')} <span className="text-sm font-normal text-[#42493e]">د.أ</span>
            </span>
          </div>

          <div className="bg-[#f8f9ff] p-3 rounded-xl flex items-center justify-between border border-[#e2e8f0]">
            <div className="flex flex-col">
              <span className="text-xs text-[#72796e]">الهدف السنوي</span>
              <span className="text-sm font-bold text-[#154212]">{totalFundTarget.toLocaleString('ar-JO')} د.أ</span>
            </div>

            <div className="w-12 h-12 rounded-full border-3 border-[#154212] border-t-transparent flex items-center justify-center relative bg-white">
              <span className="text-xs font-bold text-[#154212]">{fundHealthPct}%</span>
            </div>
          </div>
        </div>

        {/* Global Member Status List (Bento Item 3 - Full Width) */}
        <div className="md:col-span-12 bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden flex flex-col shadow-[0px_4px_12px_rgba(45,90,39,0.03)]">
          <div className="px-6 py-4 bg-[#f1f5f9] border-b border-[#e2e8f0] flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-lg font-bold text-[#0b1c30]">
              حالة دفع الأعضاء ({ARABIC_MONTHS[historyMonth - 1]} {historyYear})
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#72796e]">اختر الشهر:</span>
              <div className="relative">
                <select
                  value={historyMonth}
                  onChange={(e) => {
                    const m = Number(e.target.value) as MonthNumber;
                    setHistoryMonth(m);
                    setSelectedMonth(m);
                  }}
                  className="bg-white border border-[#c2c9bb] text-[#0b1c30] text-xs font-bold rounded-lg pl-8 pr-3 py-1.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#154212] cursor-pointer"
                >
                  {ARABIC_MONTHS.map((mName, idx) => (
                    <option key={mName} value={idx + 1}>
                      {mName} {historyYear}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-2 top-1.5 text-[#72796e] text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <div className="flex flex-col w-full divide-y divide-[#e2e8f0]">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-2.5 bg-[#f8f9ff] text-xs font-bold text-[#42493e]">
              <div className="col-span-2">العضو</div>
              <div className="text-center">حالة الدفع</div>
              <div className="text-left font-mono">المبلغ (د.أ)</div>
            </div>

            {/* Member Rows */}
            {memberMonthStatusList.slice(0, 10).map(({ member, status, amount }) => (
              <div
                key={member.id}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-3.5 items-center hover:bg-[#eff4ff] transition-colors"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    status === 'paid' ? 'bg-[#2d5a27] text-white' : (status === 'pending' ? 'bg-[#fed65b] text-[#745c00]' : 'bg-[#ffdad6] text-[#93000a]')
                  }`}>
                    {member.initials || member.name.charAt(0)}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#0b1c30]">{member.name}</span>
                    <span className="text-xs text-[#72796e] md:hidden">{amount} د.أ</span>
                  </div>
                </div>

                <div className="text-left md:text-center">
                  {status === 'paid' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#d1fae5] text-[#065f46] text-xs font-bold">
                      مسدد
                    </span>
                  )}

                  {status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#fef3c7] text-[#92400e] text-xs font-bold">
                      قيد المراجعة
                    </span>
                  )}

                  {status === 'unpaid' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#fee2e2] text-[#991b1b] text-xs font-bold">
                      غير مسدد
                    </span>
                  )}
                </div>

                <div className="hidden md:block text-left font-mono text-sm font-bold text-[#0b1c30]">
                  {amount.toLocaleString('ar-JO')}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-3.5 bg-[#f8f9ff] border-t border-[#e2e8f0] flex justify-center">
            <button
              onClick={() => setActiveTab('payments')}
              className="text-[#154212] text-xs font-bold hover:bg-[#e5eeff] px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>عرض جميع الأعضاء ({activeMembers.length})</span>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
