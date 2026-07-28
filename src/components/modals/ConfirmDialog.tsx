import React, { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'default',
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (el.open && !isOpen) el.close();
    if (!el.open && isOpen) el.showModal();
  }, [isOpen]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={handleBackdrop}
      className="backdrop:bg-black/40 rounded-2xl p-0 max-w-sm w-full shadow-2xl border border-fund-border/30"
    >
      <div className="bg-white rounded-2xl p-6">
        <div className="text-right">
          <div className="flex items-center gap-3 mb-4">
            <span className={`material-symbols-outlined ${variant === 'danger' ? 'text-status-danger' : 'text-fund-muted'}`}>
              {variant === 'danger' ? 'warning' : 'help'}
            </span>
            <p className="text-fund-text text-sm leading-relaxed">{message}</p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-fund-border/40 text-fund-muted hover:bg-fund-accent text-sm font-medium transition-all active:scale-[0.97]"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-white text-sm font-medium transition-all active:scale-[0.97] ${
                variant === 'danger'
                  ? 'bg-status-danger hover:bg-status-danger/90'
                  : 'bg-fund-green hover:bg-fund-green/90'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
