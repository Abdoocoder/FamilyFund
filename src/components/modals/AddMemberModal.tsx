import React, { useState, useEffect } from 'react';
import { useFund } from '../../context/FundContext';
import { Member } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, memberToEdit }) => {
  const { addMember, updateMember } = useFund();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+966 5');
  const [branch, setBranch] = useState('فرع عبد الله');
  const [subscriptionAmount, setSubscriptionAmount] = useState(200);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setPhone(memberToEdit.phone);
      setBranch(memberToEdit.branch || '');
      setSubscriptionAmount(memberToEdit.subscriptionAmount || 200);
    } else {
      setName('');
      setPhone('+966 5');
      setBranch('فرع عبد الله');
      setSubscriptionAmount(200);
    }
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Derive initials e.g. "أحمد عبدالله" => "أ.ع"
    const nameParts = name.trim().split(' ');
    const initials = nameParts.length >= 2
      ? `${nameParts[0].charAt(0)}.${nameParts[1].charAt(0)}`
      : `${name.charAt(0)}`;

    if (memberToEdit) {
      updateMember(memberToEdit.id, {
        name,
        phone,
        branch,
        subscriptionAmount: Number(subscriptionAmount) || 200,
        initials,
      });
    } else {
      addMember({
        name,
        phone,
        branch,
        subscriptionAmount: Number(subscriptionAmount) || 200,
        initials,
        status: 'active',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8f0] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#e2e8f0]">
          <h3 className="text-xl font-bold text-[#154212]">
            {memberToEdit ? 'تعديل بيانات العضو' : 'إضافة عضو جديد للصندوق'}
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
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: أحمد عبدالله المحمد"
              className="w-full bg-[#f8f9ff] border border-[#c2c9bb] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#154212] focus:border-[#154212] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">رقم الهاتف الجوال *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+966 50 123 4567"
              className="w-full bg-[#f8f9ff] border border-[#c2c9bb] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] dir-ltr text-right focus:ring-2 focus:ring-[#154212] focus:border-[#154212] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">فرع العائلة / اللقب</label>
            <select
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#c2c9bb] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#154212] focus:border-[#154212] outline-none cursor-pointer"
            >
              <option value="فرع عبد الله">فرع عبد الله</option>
              <option value="فرع محمد">فرع محمد</option>
              <option value="فرع عبد العزيز">فرع عبد العزيز</option>
              <option value="فرع فهد">فرع فهد</option>
              <option value="فرع صالح">فرع صالح</option>
              <option value="فرع علي">فرع علي</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">مبلغ الاشتراك الشهري (دينار أردني)</label>
            <input
              type="number"
              min="50"
              step="50"
              required
              value={subscriptionAmount}
              onChange={e => setSubscriptionAmount(Number(e.target.value))}
              className="w-full bg-[#f8f9ff] border border-[#c2c9bb] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#154212] focus:border-[#154212] outline-none"
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
              {memberToEdit ? 'حفظ التعديلات' : 'إضافة العضو'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
