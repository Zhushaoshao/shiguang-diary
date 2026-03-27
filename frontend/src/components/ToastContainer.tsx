import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

const toastStyleMap = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200 bg-emerald-50/95 text-emerald-800',
    iconClassName: 'text-emerald-500',
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-200 bg-red-50/95 text-red-800',
    iconClassName: 'text-red-500',
  },
  info: {
    icon: Info,
    className: 'border-primary-200 bg-white/95 text-neutral-ink',
    iconClassName: 'text-primary-500',
  },
} as const;

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const { icon: Icon, className, iconClassName } = toastStyleMap[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto ml-auto w-full sm:w-[380px] rounded-xl border shadow-paper-xl backdrop-blur-md animate-slide-up ${className}`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/55">
                <Icon size={18} className={iconClassName} />
              </div>
              <p className="flex-1 self-center text-sm leading-6 font-medium">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-secondary hover:bg-black/5 hover:text-neutral-ink transition-colors duration-200"
                aria-label="关闭提示"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;

