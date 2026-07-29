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
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-amber-600 text-3xl">
                hourglass_empty
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" dir="rtl">
              في انتظار الموافقة
            </h1>
            <p className="text-gray-600 mb-6" dir="rtl">
              تم تسجيل حسابك بنجاح. يرجى انتظار موافقة المسؤول على طلبك للوصول إلى النظام.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p className="text-gray-900 font-medium" dir="ltr">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-amber-600 mb-6">
              <span className="material-symbols-outlined">pending</span>
              <span className="font-medium">قيد المراجعة</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-right mb-6">
              <p className="text-sm text-blue-800" dir="rtl">
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
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                تسجيل الخروج
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-blue-600 text-3xl">
              person_add
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" dir="rtl">
            تسجيل عضوية جديدة
          </h1>
          <p className="text-gray-600 mb-6" dir="rtl">
            أهلاً {user?.firstName}! يرجى إكمال بياناتك للتسجيل في صندوق العائلة.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">البريد الإلكتروني</p>
            <p className="text-gray-900 font-medium" dir="ltr">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="text-right space-y-4" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fund-green focus:border-fund-green outline-none"
                placeholder="أدخل الاسم الكامل"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fund-green focus:border-fund-green outline-none"
                placeholder="أدخل رقم الهاتف (اختياري)"
                dir="ltr"
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-fund-green hover:bg-fund-green/90 disabled:bg-fund-green/40 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? 'جاري التسجيل...' : 'تسجيل العضوية'}
            </button>
          </form>
          <div className="mt-4">
            <SignOutButton>
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                تسجيل الخروج
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
};
