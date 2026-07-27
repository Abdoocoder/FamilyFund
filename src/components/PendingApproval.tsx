import React from 'react';
import { useUser, SignOutButton } from '@clerk/react';

export const PendingApproval: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-amber-600 text-3xl">
              hourglass_empty
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2" dir="rtl">
            في انتظار الموافقة
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6" dir="rtl">
            تم تسجيل حسابك بنجاح. يرجى انتظار موافقة المسؤول على طلبك للوصول إلى النظام.
          </p>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">البريد الإلكتروني</p>
            <p className="text-gray-900 font-medium" dir="ltr">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-amber-600 mb-6">
            <span className="material-symbols-outlined">pending</span>
            <span className="font-medium">قيد المراجعة</span>
          </div>

          {/* Instructions */}
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

          {/* Sign Out */}
          <SignOutButton>
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
              تسجيل الخروج
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};
