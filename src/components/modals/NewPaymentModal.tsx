import React, { useState, useRef, useEffect } from 'react';
import { useFund } from '../../context/FundContext';
import { ARABIC_MONTHS } from '../../data/initialMembers';
import { MonthNumber } from '../../types';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPaymentModal: React.FC<NewPaymentModalProps> = ({ isOpen, onClose }) => {
  const { members, recordNewPayment, selectedYear } = useFund();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstInputRef = useRef<HTMLSelectElement>(null);

  const activeMembers = members.filter(m => m.status === 'active');

  const [memberId, setMemberId] = useState(activeMembers[0]?.id || '');
  const [year, setYear] = useState(selectedYear);
  const [month, setMonth] = useState<MonthNumber>(1);
  const [amount, setAmount] = useState(200);
  const [note, setNote] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      requestAnimationFrame(() => firstInputRef.current?.focus());
    } else {
      dialog.close();
    }
  }, [isOpen]);

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

    onClose();
  };

  const selectedMember = activeMembers.find(m => m.id === memberId);
  const inputClass = "w-full bg-primary-subtle border border-border/60 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      className="backdrop:bg-black/40 rounded-2xl p-0 max-w-md w-full shadow-2xl border border-border/30"
    >
      <div className="bg-surface-elevated rounded-2xl p-6">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-border/40">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2 tracking-tight">
            <span className="material-symbols-outlined text-primary text-lg">payments</span>
            <span>تسجيل دفعة جديدة</span>
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-primary-subtle p-1.5 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="payment-member" className="block text-xs font-bold text-foreground mb-1.5 tracking-wide">اختر العضو *</label>
            <select
              ref={firstInputRef}
              id="payment-member"
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
              <label htmlFor="payment-year" className="block text-xs font-bold text-foreground mb-1.5 tracking-wide">السنة *</label>
              <select
                id="payment-year"
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
              <label htmlFor="payment-month" className="block text-xs font-bold text-foreground mb-1.5 tracking-wide">الشهر *</label>
              <select
                id="payment-month"
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
            <label htmlFor="payment-amount" className="block text-xs font-bold text-foreground mb-1.5 tracking-wide">المبلغ المدفوع (دينار أردني) *</label>
            <input
              id="payment-amount"
              type="number"
              min="10"
              required
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className={`${inputClass} font-bold text-primary`}
            />
            {selectedMember && (
              <p className="text-[11px] text-muted-foreground mt-1.5 tracking-wide">
                الاشتراك الشهري المحدد للعضو: {selectedMember.subscriptionAmount} د.أ
              </p>
            )}
          </div>

          <div>
            <label htmlFor="payment-note" className="block text-xs font-bold text-foreground mb-1.5 tracking-wide">ملاحظات / رقم الحوالة</label>
            <input
              id="payment-note"
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="مثال: تحويل الراجحي / رقم الإيصال #1042"
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-primary-subtle rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-light text-white rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.97]"
            >
              تأكيد وتسجيل الدفعة
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
