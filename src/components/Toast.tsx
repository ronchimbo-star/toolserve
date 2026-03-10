import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-emerald-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-amber-600';
      case 'info':
        return 'text-blue-600';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`flex items-center gap-3 min-w-[320px] max-w-md px-4 py-3 rounded-xl border-2 shadow-lg ${getStyles()}`}
      >
        <div className={getIconColor()}>{getIcon()}</div>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`p-1 rounded-lg hover:bg-white/50 transition-colors ${getIconColor()}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface ToastNotification {
  id: number;
  message: string;
  type: ToastType;
}

let toastCounter = 0;
let setToastsCallback: ((toasts: ToastNotification[]) => void) | null = null;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    setToastsCallback = setToasts;
    return () => {
      setToastsCallback = null;
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ top: `${1 + index * 5}rem` }}
          className="fixed right-4 z-[9999]"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
}

export const showToast = {
  success: (message: string) => {
    if (setToastsCallback) {
      setToastsCallback((prev) => [...prev, { id: toastCounter++, message, type: 'success' }]);
    }
  },
  error: (message: string) => {
    if (setToastsCallback) {
      setToastsCallback((prev) => [...prev, { id: toastCounter++, message, type: 'error' }]);
    }
  },
  warning: (message: string) => {
    if (setToastsCallback) {
      setToastsCallback((prev) => [...prev, { id: toastCounter++, message, type: 'warning' }]);
    }
  },
  info: (message: string) => {
    if (setToastsCallback) {
      setToastsCallback((prev) => [...prev, { id: toastCounter++, message, type: 'info' }]);
    }
  },
};
