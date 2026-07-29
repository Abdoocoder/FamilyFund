import React, { useEffect, useState } from 'react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  message,
  onUndo,
  onDismiss,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const handleUndo = () => {
    onUndo();
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-foreground text-white px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <span className="text-sm font-medium tracking-wide">{message}</span>
      <button
        onClick={handleUndo}
        className="text-primary-light font-bold text-sm px-3 py-1 rounded-lg hover:bg-surface-elevated/10 transition-colors cursor-pointer"
      >
        تراجع
      </button>
    </div>
  );
};
