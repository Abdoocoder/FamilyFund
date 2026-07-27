import React, { useState } from 'react';
import { useFund } from '../context/FundContext';
import { ARABIC_MONTHS } from '../data/initialMembers';
import { MonthNumber } from '../types';

interface PaymentMatrixProps {
  onOpenNewPayment: () => void;
}

export const PaymentMatrixView: React.FC<PaymentMatrixProps> = ({ onOpenNewPayment }) => {
  const {
    members,
    payments,
    selectedYear,
    setSelectedYear,
    togglePayment,
    exportToCSV,
    getMemberYearTotal,
  } = useFund();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'fully_paid' | 'overdue'>('all');

  // Active members only
  const activeMembers = members.filter(m => m.status === 'active');

  // Filter members based on search and payment status
  const filteredMembers = activeMembers.filter(member => {
    // 1. Search name or phone
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                          member.phone.includes(search) ||
                          (member.branch && member.branch.includes(search));

    if (!matchesSearch) return false;

    // 2. Filter mode
    const totalPaidMonths = payments.filter(
      p => p.memberId === member.id && p.year === selectedYear && p.status === 'paid'
    ).length;

    if (filterMode === 'fully_paid') {
      return totalPaidMonths === 12;
    }
    if (filterMode === 'overdue') {
      return totalPaidMonths < 12;
    }

    return true;
  });

  // Calculate monthly sum across all filtered members
  const getMonthlyTotal = (month: MonthNumber) => {
    return activeMembers.reduce((sum, member) => {
      const record = payments.find(p => p.memberId === member.id && p.year === selectedYear && p.month === month);
      return record?.status === 'paid' ? sum + (record.amount || 200) : sum;
    }, 0);
  };

  const grandTotal = activeMembers.reduce((sum, member) => sum + getMemberYearTotal(member.id, selectedYear), 0);

  return (
    <div className="space-y-4 pb-24 md:pb-8 flex flex-col min-w-0">
      {/* Header & Main Controls */}
      <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0b1c30]">جدول المدفوعات</h2>
          <p className="text-sm text-[#42493e] mt-1">إدارة ومتابعة اشتراكات الأعضاء السنوية لعام {selectedYear}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c2c9bb] rounded-xl text-[#0b1c30] hover:bg-[#eff4ff] transition-colors text-sm font-semibold shadow-2xs"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>تصدير Excel</span>
          </button>

          <button
            onClick={onOpenNewPayment}
            className="flex items-center gap-2 px-4 py-2 bg-[#154212] hover:bg-[#2d5a27] text-white rounded-xl transition-colors text-sm font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>دفعة جديدة</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Year, Filter Chips */}
      <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#e2e8f0] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#72796e]">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="البحث عن عضو..."
              className="w-full bg-white border border-[#c2c9bb] text-[#0b1c30] text-sm rounded-xl py-2 pr-10 pl-4 focus:ring-2 focus:ring-[#154212] focus:border-[#154212] transition-all placeholder-[#72796e]"
            />
          </div>

          {/* Year Select */}
          <div className="relative w-full sm:w-32">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-full bg-white border border-[#c2c9bb] text-[#0b1c30] text-sm font-bold rounded-xl py-2 pl-8 pr-4 appearance-none focus:ring-2 focus:ring-[#154212] focus:border-[#154212] cursor-pointer"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#72796e]">
              <span className="material-symbols-outlined text-xl">expand_more</span>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterMode === 'all'
                ? 'bg-[#2d5a27] text-white border-[#2d5a27]'
                : 'bg-white text-[#42493e] border-[#c2c9bb] hover:bg-[#e5eeff]'
            }`}
          >
            الكل ({activeMembers.length})
          </button>

          <button
            onClick={() => setFilterMode('fully_paid')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterMode === 'fully_paid'
                ? 'bg-[#154212] text-white border-[#154212]'
                : 'bg-white text-[#42493e] border-[#c2c9bb] hover:bg-[#e5eeff]'
            }`}
          >
            مدفوع بالكامل
          </button>

          <button
            onClick={() => setFilterMode('overdue')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterMode === 'overdue'
                ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
                : 'bg-white text-[#42493e] border-[#c2c9bb] hover:bg-[#e5eeff]'
            }`}
          >
            متأخرات
          </button>
        </div>
      </div>

      {/* Payment Matrix Canvas */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden flex flex-col min-w-0">
        <div className="overflow-x-auto matrix-scroll">
          <table className="w-full text-right border-collapse whitespace-nowrap min-w-[1100px]">
            <thead className="bg-[#eff4ff] sticky top-0 z-10 border-b border-[#e2e8f0]">
              <tr>
                {/* Sticky Member Name Header Column */}
                <th className="sticky right-0 bg-[#eff4ff] py-3.5 px-4 text-[#0b1c30] text-xs font-bold border-b border-[#e2e8f0] z-20 min-w-[210px] shadow-[1px_0_3px_rgba(0,0,0,0.04)]">
                  العضو ({filteredMembers.length})
                </th>

                {/* Months 1-12 */}
                {ARABIC_MONTHS.map((monthName, idx) => (
                  <th
                    key={monthName}
                    className="py-3 px-2 text-center text-[#42493e] text-xs font-bold border-b border-[#e2e8f0] min-w-[72px]"
                  >
                    <span className="block text-[10px] text-[#72796e] font-normal mb-0.5">{idx + 1}</span>
                    {monthName}
                  </th>
                ))}

                {/* Total Column */}
                <th className="py-3.5 px-4 text-center text-[#154212] text-xs font-bold border-b border-[#e2e8f0] min-w-[110px]">
                  الإجمالي (ر.س)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e2e8f0] text-sm text-[#0b1c30]">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-[#72796e]">
                    لا يوجد أعضاء يطابقون خيارات البحث الحالية.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const memberTotal = getMemberYearTotal(member.id, selectedYear);
                  const isFullyPaid = payments.filter(p => p.memberId === member.id && p.year === selectedYear && p.status === 'paid').length === 12;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-[#f8f9ff] transition-colors group"
                    >
                      {/* Sticky Member Column */}
                      <td className="sticky right-0 bg-white group-hover:bg-[#f8f9ff] py-2.5 px-4 border-l border-[#e2e8f0] shadow-[1px_0_3px_rgba(0,0,0,0.02)] transition-colors z-10">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isFullyPaid ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#e5eeff] text-[#154212]'
                          }`}>
                            {member.initials || member.name.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                            <span className="font-semibold text-xs md:text-sm block truncate text-[#0b1c30]">{member.name}</span>
                            <span className="text-[11px] text-[#72796e] block truncate">{member.branch || member.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* 12 Month Toggles */}
                      {ARABIC_MONTHS.map((_, idx) => {
                        const monthNum = (idx + 1) as MonthNumber;
                        const record = payments.find(p => p.memberId === member.id && p.year === selectedYear && p.month === monthNum);
                        const isPaid = record?.status === 'paid';
                        const isPending = record?.status === 'pending';

                        return (
                          <td key={monthNum} className="py-2 px-1 text-center">
                            <button
                              onClick={() => togglePayment(member.id, selectedYear, monthNum)}
                              title={`${member.name} - ${ARABIC_MONTHS[idx]} ${selectedYear}: ${isPaid ? 'مسدد (انقر للإلغاء)' : 'غير مسدد (انقر للسداد)'}`}
                              className={`payment-toggle w-full h-8 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${
                                isPaid
                                  ? 'bg-[#154212] text-white border-[#154212] shadow-2xs hover:bg-[#2d5a27]'
                                  : isPending
                                  ? 'bg-[#fef3c7] text-[#92400e] border-[#fef3c7] hover:bg-[#fde68a]'
                                  : 'bg-[#eff4ff] text-[#72796e] border-[#c2c9bb] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
                              }`}
                            >
                              {isPaid ? 'تم' : (isPending ? 'مراجعة' : '—')}
                            </button>
                          </td>
                        );
                      })}

                      {/* Total SAR */}
                      <td className="py-2.5 px-4 text-center font-bold text-sm text-[#154212] bg-white group-hover:bg-[#f8f9ff]">
                        {memberTotal.toLocaleString('ar-SA')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Matrix Footer Totals */}
            <tfoot className="bg-[#eff4ff] font-bold border-t-2 border-[#c2c9bb] text-xs text-[#0b1c30]">
              <tr>
                <td className="sticky right-0 bg-[#eff4ff] py-3.5 px-4 text-[#154212] font-bold border-l border-[#e2e8f0] shadow-[1px_0_3px_rgba(0,0,0,0.04)]">
                  إجمالي المجموع الشهري
                </td>

                {ARABIC_MONTHS.map((_, idx) => {
                  const mNum = (idx + 1) as MonthNumber;
                  const monthSum = getMonthlyTotal(mNum);
                  return (
                    <td key={mNum} className="py-3.5 px-1 text-center text-[#154212]">
                      {monthSum > 0 ? `${(monthSum / 1000).toFixed(1)}k` : '0'}
                    </td>
                  );
                })}

                <td className="py-3.5 px-4 text-center text-base text-[#154212]">
                  {grandTotal.toLocaleString('ar-SA')} ر.س
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
