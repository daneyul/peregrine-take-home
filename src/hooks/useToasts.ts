import { useState } from 'react';
import { ToastProps } from '../components/Toast/Toast';

let toastId = 0;

export const useToasts = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (message: React.ReactNode) => {
    const newToast: ToastProps = {
      id: (++toastId).toString(),
      message,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
  };
};
