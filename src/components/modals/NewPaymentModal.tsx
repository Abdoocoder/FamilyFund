import React, { useState } from 'react';
import { useFund } from '../../context/FundContext';
import { ARABIC_MONTHS } from '../../data/initialMembers';
import { MonthNumber } from '../../types';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPaymentModal: React.FC<NewPaymentModalProps> = ({ isOpen, onClose }) => {
  const { members, recordNewPayment, selectedYear } = useFund();

  const activeMembers = members.filter(m => m.status === 'active');

  const [memberId, setMemberId] = useState(activeMembers[0]?.id || '');
  const [year, setYear] = useState(selectedYear);
  const [month, setMonth] = useState<MonthNumber>(1);
  const [amount, setAmount] = useState(200);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8f0] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#e2e8f0]">
          <h3 className="text-xl font-bold text-[#154212] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#154212]">payments</span>
            <span>تسجيل دفعة جديدة</span>
          </h3>
          <button
            onClick={onClose}
            className="text-[#72796e] hover:bg-[#eff4ff] p-1.5 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">اختر العضو *</label>
            <select
              required
              value={memberId}
              onChange={e => {
                const mId = e.target.value;
                setMemberId(mId);
                const mem = activeMembers.find(m => m.id === mId);
                if (mem) setAmount(mem.subscriptionAmount || 200);
              }}
              className="w-full bg-[#f8f9ff] border border-[#c2c9bb] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#154212] outline-none cursor-pointer"
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
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">السنة *</label>
              <select
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full bg-[#f8f9ff] border border-[#c2c9bb] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#154212] outline-none cursor-pointer"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">الشهر *</label>
              <select
                value={month}
                onChange={e => setMonth(Number(e.target.value) as MonthNumber)}
                className="w-full bg-[#f8f9ff] border border-[#c2c9bb] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#154212] outline-none cursor-pointer"
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
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">المبلغ المدفوع (ريال سعودي) *</label>
            <input
              type="number"
              min="10"
              required
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full bg-[#f8f9ff] border border-[#c2c9bb] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#154212] outline-none font-bold text-[#154212]"
            />
            {selectedMember && (
              <p className="text-[11px] text-[#72796e] mt-1">
                الاشتراك الشهري المحدد للعضو: {selectedMember.subscriptionAmount} ر.س
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">ملاحظات / رقم الحوالة</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="مثال: تحويل الراجحي / رقم الإيصال #1042"
              className="w-full bg-[#f8f9ff] border border-[#c2c9bb] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#154212] outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#42493e] hover:bg-[#eff4ff] rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#154212] hover:bg-[#2d5a27] text-white rounded-xl transition-colors shadow-xs"
            >
              تأكيد وتسجيل الدفعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
