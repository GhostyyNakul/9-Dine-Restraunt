import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 right-6 z-50 glass-card bg-[#1c1b1b]/95 border border-[#f2ca50] text-[#e5e2e1] px-5 py-3.5 shadow-2xl flex items-center gap-3 rounded-sm animate-in slide-in-from-bottom duration-300">
      <span className="material-symbols-outlined text-[#8dd6ab] text-xl">
        check_circle
      </span>
      <span className="font-body-md text-xs sm:text-sm text-[#e5e2e1]">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-[#d0c5af] hover:text-[#f2ca50] focus:outline-none"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}
