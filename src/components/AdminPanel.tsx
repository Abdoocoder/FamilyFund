import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { ConfirmDialog } from './modals/ConfirmDialog';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Id<'members'> | null>(null);

  const handleApprove = async (memberId: Id<'members'>) => {
    setProcessingId(memberId);
    setErrorMsg(null);
    try {
      await approveUser({ memberId, role: selectedRole });
    } catch (error) {
      console.error('Error approving user:', error);
      setErrorMsg('تعذر قبول الطلب. الرجاء المحاولة لاحقاً.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (memberId: Id<'members'>) => {
    setProcessingId(memberId);
    setErrorMsg(null);
    try {
      await rejectUser({ memberId });
    } catch (error) {
      console.error('Error rejecting user:', error);
      setErrorMsg('تعذر رفض الطلب. الرجاء المحاولة لاحقاً.');
    } finally {
      setProcessingId(null);
      setRejectTarget(null);
    }
  };

  if (pendingMembers === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-fund-text mb-1" dir="rtl">
          إدارة طلبات العضوية
        </h1>
        <p className="text-sm text-fund-muted" dir="rtl">
          مراجعة طلبات الانضمام الجديدة
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-status-danger-surface border border-status-danger/20 rounded-xl text-status-danger text-sm text-center" dir="rtl">
          {errorMsg}
        </div>
      )}

      {pendingMembers.length === 0 ? (
        <div className="surface-elevated rounded-2xl p-8 text-center">
          <span className="material-symbols-outlined text-fund-muted text-4xl mb-3">
            check_circle
          </span>
          <p className="text-fund-muted">لا توجد طلبات معلقة</p>
          <p className="text-xs text-fund-muted/60 mt-2">سيظهر هنا طلب كل عضو جديد يقوم بالتسجيل</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingMembers.map((user) => (
            <div key={user._id} className="surface-elevated rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-fund-text" dir="rtl">
                    {user.full_name}
                  </h3>
                  {user.phone && (
                    <p className="text-fund-muted text-sm mt-0.5" dir="ltr">
                      {user.phone}
                    </p>
                  )}
                  <p className="text-fund-muted/50 text-xs mt-1">
                    {new Date(user.created_at).toLocaleDateString('ar-JO')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'member')}
                    className="border border-fund-border/40 rounded-xl px-3 py-2 text-xs text-fund-text bg-white cursor-pointer"
                  >
                    <option value="member">عضو</option>
                    <option value="admin">مسؤول</option>
                  </select>

                  <button
                    onClick={() => handleApprove(user._id)}
                    disabled={processingId === user._id}
                    className="bg-fund-green text-white hover:bg-fund-green/90 px-4 py-2 rounded-xl text-xs font-medium transition-all active:scale-[0.97] disabled:opacity-50 cursor-pointer"
                  >
                    {processingId === user._id ? 'قبول...' : 'قبول'}
                  </button>

                  <button
                    onClick={() => setRejectTarget(user._id)}
                    disabled={processingId === user._id}
                    className="bg-status-danger text-white hover:bg-status-danger/90 px-4 py-2 rounded-xl text-xs font-medium transition-all active:scale-[0.97] disabled:opacity-50 cursor-pointer"
                  >
                    رفض
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!rejectTarget}
        message="رفض الطلب؟ لن يتمكن العضو من الانضمام."
        confirmLabel="رفض العضو"
        cancelLabel="إلغاء"
        variant="danger"
        onConfirm={() => rejectTarget && handleReject(rejectTarget)}
        onCancel={() => setRejectTarget(null)}
      />
    </div>
  );
};
