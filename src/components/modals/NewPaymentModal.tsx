import React, { useState, useRef, useEffect } from 'react';
import { useFund } from '../../context/FundContext';
import { ARABIC_MONTHS } from '../../data/initialMembers';
import { MonthNumber } from '../../types';
import gsap from 'gsap';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPaymentModal: React.FC<NewPaymentModalProps> = ({ isOpen, onClose }) => {
  const { members, recordNewPayment, selectedYear } = useFund();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeMembers = members.filter(m => m.status === 'active');

  const [memberId, setMemberId] = useState(activeMembers[0]?.id || '');
  const [year, setYear] = useState(selectedYear);
  const [month, setMonth] = useState<MonthNumber>(1);
  const [amount, setAmount] = useState(200);
  const [note, setNote] = useState('');

  // GSAP entrance
  useEffect(() => {
    if (isOpen && overlayRef.current && panelRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(overlayRef, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        gsap.fromTo(panelRef, {
          opacity: 0, scale: 0.95, y: 12,
        }, {
          opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out', delay: 0.05,
        });
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (overlayRef.current && panelRef.current) {
      const ctx = gsap.context(() => {
        gsap.to(panelRef, { opacity: 0, scale: 0.97, y: 8, duration: 0.2, ease: 'power2.in' });
        gsap.to(overlayRef, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: onClose });
      });
      setTimeout(() => ctx.revert(), 300);
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;

    recordNewPayment({
      memberId,
      year,
      month,
      amount: Number(amount) || 200,
      note,
    });

    handleClose();
  };

  const selectedMember = activeMembers.find(m => m.id === memberId);
  const inputClass = "w-full bg-fund-accent/40 border border-fund-border/60 rounded-xl px-3.5 py-2.5 text-sm text-fund-text focus:ring-2 focus:ring-fund-green/20 focus:border-fund-green outline-none transition-all";

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div ref={panelRef} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-fund-border/30">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-fund-border/40">
          <h3 className="text-xl font-bold text-fund-green flex items-center gap-2 tracking-tight">
            <span className="material-symbols-outlined text-fund-green text-lg">payments</span>
            <span>تسجيل دفعة جديدة</span>
          </h3>
          <button
            onClick={handleClose}
            className="text-fund-muted hover:bg-fund-accent p-1.5 rounded-xl transition-colors duration-300 hover:scale-110 active:scale-90"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-fund-text mb-1.5 tracking-wide">اختر العضو *</label>
            <select
              required
              value={memberId}
              onChange={e => {
                const mId = e.target.value;
                setMemberId(mId);
                const mem = activeMembers.find(m => m.id === mId);
                if (mem) setAmount(mem.subscriptionAmount || 200);
              }}
              className={`${inputClass} cursor-pointer`}
            >
              {activeMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-fund-text mb-1.5 tracking-wide">السنة *</label>
              <select
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className={`${inputClass} cursor-pointer font-bold`}
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-fund-text mb-1.5 tracking-wide">الشهر *</label>
              <select
                value={month}
                onChange={e => setMonth(Number(e.target.value) as MonthNumber)}
                className={`${inputClass} cursor-pointer font-bold`}
              >
                {ARABIC_MONTHS.map((mName, idx) => (
                  <option key={mName} value={idx + 1}>
                    {idx + 1} - {mName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-fund-text mb-1.5 tracking-wide">المبلغ المدفوع (دينار أردني) *</label>
            <input
              type="number"
              min="10"
              required
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className={`${inputClass} font-bold text-fund-green`}
            />
            {selectedMember && (
              <p className="text-[11px] text-fund-muted mt-1.5 tracking-wide">
                الاشتراك الشهري المحدد للعضو: {selectedMember.subscriptionAmount} د.أ
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-fund-text mb-1.5 tracking-wide">ملاحظات / رقم الحوالة</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="مثال: تحويل الراجحي / رقم الإيصال #1042"
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-fund-border/40">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-fund-muted hover:bg-fund-accent rounded-xl transition-colors duration-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-fund-green hover:bg-fund-green-light text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.97]"
            >
              تأكيد وتسجيل الدفعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
