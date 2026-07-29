import React, { useState } from 'react';
import { useUser, SignOutButton } from '@clerk/react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const PendingApproval: React.FC = () => {
  const { user } = useUser();
  const registerUser = useMutation(api.members.registerUser);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await registerUser({
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
      });
      setIsRegistered(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.message?.includes('already registered')) {
        setIsRegistered(true);
      } else {
        setError('تعذر التسجيل. الرجاء المحاولة لاحقاً.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="max-w-md w-full mx-4">
          <div className="surface-elevated p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-warning-bg rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-warning text-3xl">
                hourglass_empty
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2" dir="rtl">
              في انتظار الموافقة
            </h1>
            <p className="text-muted mb-6" dir="rtl">
              تم تسجيل حسابك بنجاح. يرجى انتظار موافقة المسؤول على طلبك للوصول إلى النظام.
            </p>
            <div className="bg-primary-subtle rounded-lg p-4 mb-6">
              <p className="text-sm text-muted">البريد الإلكتروني</p>
              <p className="text-foreground font-medium" dir="ltr">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-warning mb-6">
              <span className="material-symbols-outlined">pending</span>
              <span className="font-medium">قيد المراجعة</span>
            </div>
            <div className="bg-primary-subtle rounded-lg p-4 text-right mb-6 border border-primary/10">
              <p className="text-sm text-primary" dir="rtl">
                <strong>الخطوات التالية:</strong>
                <br />
                1. سيقوم المسؤول بمراجعة طلبك
                <br />
                2. سيتم إشعارك عند الموافقة
                <br />
                3. يمكنك تسجيل الدخول مرة أخرى للوصول
              </p>
            </div>
            <SignOutButton>
              <button className="w-full bg-primary-subtle hover:bg-border text-foreground font-medium py-2.5 px-4 rounded-xl transition-all active:scale-[0.97]">
                تسجيل الخروج
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="max-w-md w-full mx-4">
        <div className="surface-elevated p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-primary-subtle rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">
              person_add
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2" dir="rtl">
            تسجيل عضوية جديدة
          </h1>
          <p className="text-muted mb-6" dir="rtl">
            أهلاً {user?.firstName}! يرجى إكمال بياناتك للتسجيل في صندوق العائلة.
          </p>
          <div className="bg-primary-subtle rounded-lg p-4 mb-6">
            <p className="text-sm text-muted">البريد الإلكتروني</p>
            <p className="text-foreground font-medium" dir="ltr">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="text-right space-y-4" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">الاسم الكامل *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-primary-subtle border border-border/60 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="أدخل الاسم الكامل"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-primary-subtle border border-border/60 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="أدخل رقم الهاتف (اختياري)"
                dir="ltr"
              />
            </div>
            {error && (
              <div className="bg-danger-bg text-danger text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-light disabled:opacity-40 text-white font-medium py-2.5 px-4 rounded-xl transition-all active:scale-[0.97]"
            >
              {isSubmitting ? 'جاري التسجيل...' : 'تسجيل العضوية'}
            </button>
          </form>
          <div className="mt-4">
            <SignOutButton>
              <button className="text-sm text-muted hover:text-foreground transition-colors">
                تسجيل الخروج
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
};
