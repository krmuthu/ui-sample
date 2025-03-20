import { useContext } from 'react';
import React from 'react';

export interface ToastOptions {
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

interface ToastContextType {
  addToast: (options: ToastOptions) => void;
  removeToast: (id: string) => void;
  removeAll: () => void;
}

// Import this from your Toast component once implemented
const ToastContext = React.createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return {
    show: context.addToast,
    dismiss: context.removeToast,
    dismissAll: context.removeAll,
  };
}; 