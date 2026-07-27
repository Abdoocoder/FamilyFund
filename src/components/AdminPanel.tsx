import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface PendingUser {
  _id: Id<'members'>;
  full_name: string;
  phone?: string;
  clerk_user_id?: string;
  created_at: number;
}

export const AdminPanel: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');
  const pendingMembers = useQuery(api.members.getPendingMembers);
  const approveUser = useMutation(api.members.approveUser);
  const rejectUser = useMutation(api.members.rejectUser);
  const [processingId, setProcessingId] = useState<Id<'members'> | null>(null);

  const handleApprove = async (memberId: Id<'members'>) => {
    setProcessingId(memberId);
    try {
      await approveUser({ memberId, role: selectedRole });
    } catch (error) {
      console.error('Error approving user:', error);
      alert('حدث خطأ أثناء الموافقة');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (memberId: Id<'members'>) => {
    if (!confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;

    setProcessingId(memberId);
    try {
      await rejectUser({ memberId });
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('حدث خطأ أثناء الرفض');
    } finally {
      setProcessingId(null);
    }
  };

  if (pendingMembers === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" dir="rtl">
          إدارة طلبات العضوية
        </h1>
        <p className="text-gray-600" dir="rtl">
          مراجعة والموافقة على طلبات الانضمام الجديدة
        </p>
      </div>

      {pendingMembers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <span className="material-symbols-outlined text-gray-400 text-5xl mb-4">
            check_circle
          </span>
          <p className="text-gray-600">لا توجد طلبات معلقة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingMembers.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900" dir="rtl">
                    {user.full_name}
                  </h3>
                  {user.phone && (
                    <p className="text-gray-600 text-sm mt-1" dir="ltr">
                      {user.phone}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">
                    تم التسجيل: {new Date(user.created_at).toLocaleDateString('ar-JO')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Role Selector */}
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'member')}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="member">عضو</option>
                    <option value="admin">مسؤول</option>
                  </select>

                  {/* Approve Button */}
                  <button
                    onClick={() => handleApprove(user._id)}
                    disabled={processingId === user._id}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {processingId === user._id ? 'جاري...' : 'موافقة'}
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleReject(user._id)}
                    disabled={processingId === user._id}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    رفض
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
