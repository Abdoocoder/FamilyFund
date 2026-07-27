import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFund } from '../context/FundContext';
import { ARABIC_MONTHS } from '../data/initialMembers';
import { MonthNumber } from '../types';
import gsap from 'gsap';
import { UndoToast } from './UndoToast';

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
  const [undoToast, setUndoToast] = useState<{ message: string; onUndo: () => void } | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Build a lookup Map for O(1) payment access
  const paymentMap = React.useMemo(() => {
    const map = new Map<string, typeof payments[0]>();
    for (const p of payments) {
      if (p.year === selectedYear) {
        map.set(`${p.memberId}-${p.year}-${p.month}`, p);
      }
    }
    return map;
  }, [payments, selectedYear]);

  const activeMembers = members.filter(m => m.status === 'active');

  const filteredMembers = React.useMemo(() => activeMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                          member.phone.includes(search) ||
                          (member.branch && member.branch.includes(search));
    if (!matchesSearch) return false;

    const totalPaidMonths = payments.filter(
      p => p.memberId === member.id && p.year === selectedYear && p.status === 'paid'
    ).length;

    if (filterMode === 'fully_paid') return totalPaidMonths === 12;
    if (filterMode === 'overdue') return totalPaidMonths < 12;
    return true;
  }), [activeMembers, search, payments, selectedYear, filterMode]);

  const getMonthlyTotal = (month: MonthNumber) => {
    return activeMembers.reduce((sum, member) => {
      const record = paymentMap.get(`${member.id}-${selectedYear}-${month}`);
      return record?.status === 'paid' ? sum + (record.amount || member.subscriptionAmount) : sum;
    }, 0);
  };

  const grandTotal = activeMembers.reduce((sum, member) => sum + getMemberYearTotal(member.id, selectedYear), 0);

  const handleTogglePayment = useCallback((memberId: string, year: number, month: MonthNumber) => {
    const existing = payments.find(p => p.memberId === memberId && p.year === year && p.month === month);
    const prevStatus = existing?.status || 'unpaid';
    const member = members.find(m => m.id === memberId);
    const memberName = member?.name || '';
    const monthName = ARABIC_MONTHS[month - 1];

    togglePayment(memberId, year, month);

    if (prevStatus !== 'paid') {
      setUndoToast({
        message: `تم تسجيل دفع ${memberName} — ${monthName} ${year}`,
        onUndo: () => togglePayment(memberId, year, month),
      });
    }
  }, [payments, members, togglePayment]);

  // GSAP entrance — slide-from-right for the data-heavy matrix
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.from(tableRef.current, {
        opacity: 0,
        x: 30,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-4 pb-24 md:pb-8 flex flex-col min-w-0">
      {/* Header & Controls */}
      <div ref={headerRef} className="surface-elevated p-5 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-fund-text tracking-tight" style={{ textWrap: 'balance' }}>جدول المدفوعات</h2>
          <p className="text-sm text-fund-muted mt-1 tracking-wide">
            إدارة ومتابعة اشتراكات الأعضاء السنوية لعام {selectedYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-fund-border rounded-xl text-fund-text hover:bg-fund-accent transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow-md active:scale-[0.97]"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>تصدير Excel</span>
          </button>

          <button
            onClick={onOpenNewPayment}
            className="flex items-center gap-2 px-4 py-2.5 bg-fund-green hover:bg-fund-green-light text-white rounded-xl transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-fund-green/15 active:scale-[0.97]"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>دفعة جديدة</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-fund-border/40 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-fund-muted">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="البحث عن عضو..."
              aria-label="البحث عن عضو"
              className="w-full bg-white border border-fund-border/60 text-fund-text text-sm rounded-xl py-2.5 pr-10 pl-4 focus:ring-2 focus:ring-fund-green/20 focus:border-fund-green transition-all placeholder-fund-muted/60 shadow-sm"
            />
          </div>

          <div className="relative w-full sm:w-32">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-full bg-white border border-fund-border/60 text-fund-text text-sm font-bold rounded-xl py-2.5 pl-8 pr-4 appearance-none focus:ring-2 focus:ring-fund-green/20 focus:border-fund-green cursor-pointer shadow-sm"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fund-muted">
              <span className="material-symbols-outlined text-xl">expand_more</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { mode: 'all' as const, label: `الكل (${activeMembers.length})`, color: 'bg-fund-green-light text-white border-fund-green-light' },
            { mode: 'fully_paid' as const, label: 'مدفوع بالكامل', color: 'bg-fund-green text-white border-fund-green' },
            { mode: 'overdue' as const, label: 'متأخرات', color: 'bg-status-danger text-white border-status-danger' },
          ].map(chip => (
            <button
              key={chip.mode}
              onClick={() => setFilterMode(chip.mode)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 focus-visible:ring-2 focus-visible:ring-fund-green focus-visible:outline-none ${
                filterMode === chip.mode
                  ? `${chip.color} shadow-sm`
                  : 'bg-white text-fund-muted border-fund-border/60 hover:bg-fund-accent hover:border-fund-green/20'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Canvas */}
      <div ref={tableRef} className="surface-elevated rounded-2xl overflow-hidden flex flex-col min-w-0">
        <div className="overflow-x-auto matrix-scroll">
          <table className="w-full text-right border-collapse whitespace-nowrap min-w-[1100px]">
            <thead className="bg-fund-accent/80 sticky top-0 z-10 border-b border-fund-border/60">
              <tr>
                <th className="sticky right-0 bg-fund-accent/80 py-3.5 px-4 text-fund-text text-xs font-bold border-b border-fund-border/60 z-20 min-w-[210px] shadow-[1px_0_3px_rgba(0,0,0,0.03)]">
                  العضو ({filteredMembers.length})
                </th>
                {ARABIC_MONTHS.map((monthName, idx) => (
                  <th key={monthName} className="py-3 px-2 text-center text-fund-muted text-xs font-bold border-b border-fund-border/60 min-w-[72px]">
                    <span className="block text-[10px] text-fund-muted/60 font-normal mb-0.5">{idx + 1}</span>
                    {monthName}
                  </th>
                ))}
                <th className="py-3.5 px-4 text-center text-fund-green text-xs font-bold border-b border-fund-border/60 min-w-[110px]">
                  الإجمالي (د.أ)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-fund-border/40 text-sm text-fund-text">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-16 text-center text-fund-muted">
                    <span className="material-symbols-outlined text-4xl text-fund-border mb-2 block">search_off</span>
                    لا يوجد أعضاء يطابقون خيارات البحث الحالية.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const memberTotal = getMemberYearTotal(member.id, selectedYear);
                  const isFullyPaid = Array.from({ length: 12 }, (_, i) =>
                    paymentMap.get(`${member.id}-${selectedYear}-${(i + 1) as MonthNumber}`)?.status === 'paid'
                  ).length === 12;

                  return (
                    <tr key={member.id} className="hover:bg-fund-accent/30 transition-all duration-200 group">
                      <td className="sticky right-0 bg-white group-hover:bg-fund-accent/30 py-2.5 px-4 border-l border-fund-border/40 shadow-[1px_0_3px_rgba(0,0,0,0.02)] transition-colors z-10">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-300 ${
                            isFullyPaid ? 'bg-status-paid-bg text-status-paid' : 'bg-fund-accent text-fund-green'
                          }`}>
                            {member.initials || member.name.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                            <span className="font-semibold text-xs md:text-sm block truncate text-fund-text tracking-wide">{member.name}</span>
                            <span className="text-[11px] text-fund-muted block truncate">{member.branch || member.phone}</span>
                          </div>
                        </div>
                      </td>

                      {ARABIC_MONTHS.map((_, idx) => {
                        const monthNum = (idx + 1) as MonthNumber;
                        const record = paymentMap.get(`${member.id}-${selectedYear}-${monthNum}`);
                        const isPaid = record?.status === 'paid';
                        const isPending = record?.status === 'pending';

                        return (
                          <td key={monthNum} className="py-2 px-1 text-center">
                            <button
                              onClick={() => handleTogglePayment(member.id, selectedYear, monthNum)}
                              aria-label={`${member.name} — ${ARABIC_MONTHS[idx]} ${selectedYear}: ${isPaid ? 'مسدد، انقر للإلغاء' : 'غير مسدد، انقر للسداد'}`}
                              className={`payment-toggle w-full min-h-[44px] rounded-lg border text-xs font-bold flex items-center justify-center focus-visible:ring-2 focus-visible:ring-fund-green focus-visible:outline-none ${
                                isPaid
                                  ? 'bg-fund-green text-white border-fund-green shadow-sm shadow-fund-green/15 hover:bg-fund-green-light'
                                  : isPending
                                  ? 'bg-status-pending-bg text-status-pending border-status-pending-bg/80 hover:bg-status-pending-bg/80'
                                  : 'bg-fund-accent/60 text-fund-muted border-fund-border/40 hover:bg-fund-accent hover:text-fund-text hover:border-fund-green/20'
                              }`}
                            >
                              {isPaid ? 'تم' : (isPending ? 'مراجعة' : '—')}
                            </button>
                          </td>
                        );
                      })}

                      <td className="py-2.5 px-4 text-center font-bold text-sm text-fund-green bg-white group-hover:bg-fund-accent/30 tabular-nums transition-colors">
                        {memberTotal.toLocaleString('ar-JO')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            <tfoot className="bg-fund-accent/80 font-bold border-t-2 border-fund-border/60 text-xs text-fund-text">
              <tr>
                <td className="sticky right-0 bg-fund-accent/80 py-3.5 px-4 text-fund-green font-bold border-l border-fund-border/60 shadow-[1px_0_3px_rgba(0,0,0,0.03)]">
                  إجمالي المجموع الشهري
                </td>
                {ARABIC_MONTHS.map((_, idx) => {
                  const mNum = (idx + 1) as MonthNumber;
                  const monthSum = getMonthlyTotal(mNum);
                  return (
                    <td key={mNum} className="py-3.5 px-1 text-center text-fund-green tabular-nums">
                      {monthSum > 0 ? `${(monthSum / 1000).toFixed(1)}k` : '0'}
                    </td>
                  );
                })}
                <td className="py-3.5 px-4 text-center text-base text-fund-green tabular-nums font-bold">
                  {grandTotal.toLocaleString('ar-JO')} د.أ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {undoToast && (
        <UndoToast
          message={undoToast.message}
          onUndo={undoToast.onUndo}
          onDismiss={() => setUndoToast(null)}
        />
      )}
    </div>
  );
};
