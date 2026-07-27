import React, { useState, useEffect, useRef } from 'react';
import { useFund } from '../../context/FundContext';
import { Member } from '../../types';
import gsap from 'gsap';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, memberToEdit }) => {
  const { addMember, updateMember } = useFund();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // GSAP entrance animation
  useEffect(() => {
    if (isOpen && overlayRef.current && panelRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        gsap.fromTo(panelRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 12,
        }, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.35,
          ease: 'power3.out',
          delay: 0.05,
        });
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (overlayRef.current && panelRef.current) {
      const ctx = gsap.context(() => {
        gsap.to(panelRef.current, { opacity: 0, scale: 0.97, y: 8, duration: 0.2, ease: 'power2.in' });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: onClose });
      });
      // Cleanup context after animation
      setTimeout(() => ctx.revert(), 300);
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const nameParts = name.trim().split(' ');
    const initials = nameParts.length >= 2
      ? `${nameParts[0].charAt(0)}.${nameParts[1].charAt(0)}`
      : `${name.charAt(0)}`;

    if (memberToEdit) {
      updateMember(memberToEdit.id, { name, phone, branch, subscriptionAmount: Number(subscriptionAmount) || 200, initials });
    } else {
      addMember({ name, phone, branch, subscriptionAmount: Number(subscriptionAmount) || 200, initials, status: 'active' });
    }

    handleClose();
  };

  const inputClass = "w-full bg-fund-accent/40 border border-fund-border/60 rounded-xl px-3.5 py-2.5 text-sm text-fund-text focus:ring-2 focus:ring-fund-green/20 focus:border-fund-green outline-none transition-all placeholder-fund-muted/50";

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div ref={panelRef} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-fund-border/30">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-fund-border/40">
          <h3 className="text-xl font-bold text-fund-green tracking-tight">
            {memberToEdit ? 'تعديل بيانات العضو' : 'إضافة عضو جديد للصندوق'}
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
            <label className="block text-xs font-bold text-fund-text mb-1.5 tracking-wide">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: أحمد عبدالله المحمد"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fund-text mb-1.5 tracking-wide">رقم الهاتف الجوال *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+966 50 123 4567"
              className={`${inputClass} dir-ltr text-right`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fund-text mb-1.5 tracking-wide">فرع العائلة / اللقب</label>
            <input
              type="text"
              value={branch}
              onChange={e => setBranch(e.target.value)}
              list="branch-suggestions"
              placeholder="مثال: فرع محمد"
              className={inputClass}
            />
            <datalist id="branch-suggestions">
              <option value="فرع سالم" />
              <option value="فرع محمد" />
              <option value="فرع محمود" />
              <option value="فرع جمال" />
              <option value="فرع فراس" />
              <option value="فرع فاس" />
              <option value="فرع عليان" />
              <option value="فرع هاشم" />
              <option value="فرع عطا" />
              <option value="فرع خليل" />
              <option value="فرع سلمان" />
              <option value="فرع سليمان" />
              <option value="فرع موسى" />
              <option value="فرع حسن" />
              <option value="فرع صالح" />
              <option value="فرع علي" />
              <option value="فرع كريم" />
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold text-fund-text mb-1.5 tracking-wide">مبلغ الاشتراك الشهري (دينار أردني)</label>
            <input
              type="number"
              min="50"
              step="50"
              required
              value={subscriptionAmount}
              onChange={e => setSubscriptionAmount(Number(e.target.value))}
              className={`${inputClass} font-bold text-fund-green`}
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
              {memberToEdit ? 'حفظ التعديلات' : 'إضافة العضو'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
