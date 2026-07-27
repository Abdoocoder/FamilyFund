import React, { useState } from 'react';
import { useFund } from '../context/FundContext';
import { ARABIC_MONTHS } from '../data/initialMembers';

export const DashboardView: React.FC = () => {
  const { getYearStats, transactions, selectedYear, setSelectedYear, payments, setActiveTab } = useFund();
  const [chartYear, setChartYear] = useState<number>(selectedYear);

  const stats = getYearStats(chartYear);

  // Format number with Arabic locale or comma separation
  const formatAmount = (num: number) => {
    return num.toLocaleString('ar-JO');
  };

  // Calculate monthly collection for the chart
  const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthPayments = payments.filter(p => p.year === chartYear && p.month === month && p.status === 'paid');
    return monthPayments.reduce((sum, p) => sum + (p.amount || 200), 0);
  });

  const maxMonthVal = Math.max(...monthlyTotals, 10000);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Welcome Header */}
      <section className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <h2 className="text-2xl md:text-3xl text-[#154212] font-bold">مرحباً بعودتك، المحاسب</h2>
        <p className="text-sm md:text-base text-[#42493e] mt-1">
          إليك نظرة عامة على حالة الصندوق واشتراكات الأعضاء لعام {chartYear}.
        </p>
      </section>

      {/* KPI Cards Section (Bento Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Expected */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex flex-col justify-between hover:shadow-[0px_4px_12px_rgba(45,90,39,0.05)] transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs md:text-sm text-[#42493e] font-medium">إجمالي المتوقع</span>
            <div className="w-9 h-9 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#154212]">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl text-[#154212] font-bold">{formatAmount(stats.expected)}</div>
            <div className="text-xs text-[#72796e] mt-1">دينار أردني (سنوياً)</div>
          </div>
        </div>

        {/* Total Collected */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex flex-col justify-between hover:shadow-[0px_4px_12px_rgba(45,90,39,0.05)] transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs md:text-sm text-[#42493e] font-medium">إجمالي المحصل</span>
            <div className="w-9 h-9 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#2d5a27]">
              <span className="material-symbols-outlined">savings</span>
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl text-[#154212] font-bold">{formatAmount(stats.collected)}</div>
            <div className="text-xs text-[#72796e] mt-1">دينار أردني (حتى الآن)</div>
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex flex-col justify-between hover:shadow-[0px_4px_12px_rgba(45,90,39,0.05)] transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs md:text-sm text-[#42493e] font-medium">المبلغ المتبقي</span>
            <div className="w-9 h-9 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl text-[#ba1a1a] font-bold">{formatAmount(stats.remaining)}</div>
            <div className="text-xs text-[#72796e] mt-1">دينار أردني (مستحق)</div>
          </div>
        </div>

        {/* Compliance Rate */}
        <div className="bg-gradient-to-br from-white to-[#eff4ff] border border-[#e2e8f0] rounded-xl p-5 flex flex-col justify-between hover:shadow-[0px_4px_12px_rgba(45,90,39,0.05)] transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs md:text-sm text-[#42493e] font-medium">نسبة الالتزام</span>
            <div className="w-9 h-9 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#065f46]">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
          </div>
          <div>
            <div className="flex items-end gap-2">
              <div className="text-2xl md:text-3xl text-[#154212] font-bold">%{stats.complianceRate}</div>
              <div className="text-xs text-[#2d5a27] font-semibold mb-1 flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +5%
              </div>
            </div>
            <div className="w-full bg-[#dce9ff] rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-[#154212] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(stats.complianceRate, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Chart & Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-5 flex flex-col shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#154212]">تقدم التحصيل الشهري</h3>
            <div className="flex items-center gap-2">
              {[2024, 2025, 2026].map(yr => (
                <button
                  key={yr}
                  onClick={() => {
                    setChartYear(yr);
                    setSelectedYear(yr);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    chartYear === yr
                      ? 'bg-[#154212] text-white'
                      : 'bg-[#eff4ff] text-[#42493e] hover:bg-[#e5eeff]'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="flex-grow flex items-end justify-between gap-2 pt-6 h-[220px] border-b border-[#e2e8f0] relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-40">
              <div className="border-t border-dashed border-[#c2c9bb] w-full"></div>
              <div className="border-t border-dashed border-[#c2c9bb] w-full"></div>
              <div className="border-t border-dashed border-[#c2c9bb] w-full"></div>
            </div>

            {/* Bars */}
            {ARABIC_MONTHS.map((monthName, i) => {
              const amount = monthlyTotals[i];
              const heightPct = maxMonthVal > 0 ? Math.min(Math.round((amount / maxMonthVal) * 100), 100) : 0;
              const isCurrentOrPeak = amount > 0;

              return (
                <div key={monthName} className="w-full flex flex-col items-center gap-2 relative z-10 group">
                  {/* Tooltip */}
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0b1c30] text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                    {amount.toLocaleString('ar-JO')} د.أ
                  </div>
                  
                  <div className="w-full max-w-[28px] bg-[#e5eeff] rounded-t-md h-full flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isCurrentOrPeak ? 'bg-[#154212] group-hover:bg-[#2d5a27]' : 'bg-[#c2c9bb]'
                      }`}
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-[#42493e] truncate max-w-full font-medium">
                    {monthName}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-[#72796e]">
            <span>إجمالي تحصيل العام: <strong className="text-[#154212]">{formatAmount(stats.collected)} د.أ</strong></span>
            <span>الهدف السنوي: {formatAmount(stats.expected)} د.أ</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex flex-col shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#154212]">أحدث العمليات</h3>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-semibold text-[#154212] hover:bg-[#eff4ff] px-2.5 py-1 rounded transition-colors"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 hover:bg-[#f8f9ff] rounded-lg transition-colors border border-transparent hover:border-[#e2e8f0]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2d5a27] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {tx.memberName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0b1c30]">{tx.memberName}</div>
                    <div className="text-xs text-[#72796e]">{tx.date}</div>
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-sm font-bold text-[#154212]">+{tx.amount.toLocaleString('ar-JO')} د.أ</div>
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 ${
                    tx.status === 'completed'
                      ? 'bg-[#d1fae5] text-[#065f46]'
                      : 'bg-[#fef3c7] text-[#92400e]'
                  }`}>
                    {tx.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('payments')}
            className="w-full mt-4 py-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#154212] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-base">table_chart</span>
            <span>الانتقال لجدول المحاسبة الشامل</span>
          </button>
        </div>
      </section>
    </div>
  );
};
