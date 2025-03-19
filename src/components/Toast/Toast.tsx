import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type ToastPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
export type ToastSize = 'sm' | 'md' | 'lg';

export interface ToastProps {
  /**
   * Unique identifier for the toast
   */
  id: string;
  
  /**
   * Title of the toast
   */
  title?: React.ReactNode;
  
  /**
   * Message content of the toast
   */
  message: React.ReactNode;
  
  /**
   * Visual variant of the toast
   * @default "neutral"
   */
  variant?: ToastVariant;
  
  /**
   * Duration in milliseconds before auto-dismissing
   * @default 5000
   */
  duration?: number;
  
  /**
   * Whether the toast can be dismissed by clicking the close button
   * @default true
   */
  dismissible?: boolean;
  
  /**
   * Whether to show a progress bar indicating time until auto-dismiss
   * @default false
   */
  showProgress?: boolean;
  
  /**
   * Size of the toast
   * @default "md"
   */
  size?: ToastSize;
  
  /**
   * Action button configuration
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  
  /**
   * Custom class name for the toast
   */
  className?: string;
  
  /**
   * Callback function to be called when the toast is closed
   */
  onClose?: () => void;
}

export interface ToastProviderProps {
  /**
   * Children to render
   */
  children: React.ReactNode;
  
  /**
   * Maximum number of toasts to show at once
   * @default 5
   */
  maxToasts?: number;
  
  /**
   * Default duration for toasts in milliseconds
   * @default 5000
   */
  defaultDuration?: number;
  
  /**
   * Default placement for toasts
   * @default "top-right"
   */
  defaultPlacement?: ToastPlacement;
  
  /**
   * Default size for toasts
   * @default "md"
   */
  defaultSize?: ToastSize;
  
  /**
   * Whether to show progress bars by default
   * @default false
   */
  defaultShowProgress?: boolean;
}

interface ToastState {
  toasts: ToastProps[];
  placement: ToastPlacement;
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: ToastProps }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'UPDATE_TOAST'; id: string; updates: Partial<ToastProps> }
  | { type: 'CLEAR_TOASTS' }
  | { type: 'SET_PLACEMENT'; placement: ToastPlacement };

interface ToastContextValue {
  toasts: ToastProps[];
  show: (toast: Omit<ToastProps, 'id'>) => string;
  update: (id: string, toast: Partial<Omit<ToastProps, 'id'>>) => void;
  clear: () => void;
  setPlacement: (placement: ToastPlacement) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.id),
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === action.id ? { ...toast, ...action.updates } : toast
        ),
      };
    case 'CLEAR_TOASTS':
      return {
        ...state,
        toasts: [],
      };
    case 'SET_PLACEMENT':
      return {
        ...state,
        placement: action.placement,
      };
    default:
      return state;
  }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const getVariantIcon = (variant: ToastVariant) => {
  switch (variant) {
    case 'info':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'success':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
};

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  variant = 'neutral',
  duration = 5000,
  dismissible = true,
  showProgress = false,
  size = 'medium',
  action,
  onClose,
  className,
}) => {
  const { update } = useToast();
  
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const variantClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    neutral: 'bg-gray-50 text-gray-800 border-gray-200',
  }[variant];

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3',
    lg: 'p-4 text-lg',
  }[size];

  return (
    <div
      className={clsx(
        'toast',
        `toast--${variant}`,
        `toast--${size}`,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {variant !== 'neutral' && (
          <div className="flex-shrink-0">
            {getVariantIcon(variant)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium">
              {title}
            </div>
          )}
          <div className={title ? 'mt-1' : ''}>
            {message}
          </div>
        </div>
        
        <div className="flex-shrink-0 flex items-start gap-2">
          {action && (
            <button
              onClick={action.onClick}
              className={`
                text-sm font-medium hover:opacity-80
                ${variant === 'neutral' ? 'text-blue-600' : ''}
              `}
            >
              {action.label}
            </button>
          )}
          
          {dismissible && (
            <button
              className="toast-close"
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
      </div>
      
      {showProgress && (
        <div
          className={`
            absolute bottom-0 left-0 h-1
            ${variant === 'neutral' ? 'bg-gray-200' : `bg-${variant}-200`}
          `}
          style={{
            width: '100%',
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
};

const ToastContainer: React.FC<{ placement: ToastPlacement }> = ({ placement }) => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('ToastContainer must be used within a ToastProvider');
  }
  
  const placementClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  }[placement];

  return createPortal(
    <div
      className={`
        fixed z-50 m-4 flex flex-col gap-2
        ${placementClasses}
      `}
      style={{
        maxWidth: 'calc(100% - 2rem)',
        width: '24rem',
      }}
    >
      {context.toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
};

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  defaultDuration = 5000,
  defaultPlacement = 'top-right',
  defaultSize = 'md',
  defaultShowProgress = false,
}) => {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
    placement: defaultPlacement,
  });

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = generateId();
    
    const newToast: ToastProps = {
      id,
      duration: defaultDuration,
      size: defaultSize,
      showProgress: defaultShowProgress,
      ...toast,
    };
    
    dispatch({ type: 'ADD_TOAST', toast: newToast });
    
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', id });
      }, newToast.duration);
    }
    
    // Remove oldest toast if exceeding maxToasts
    if (state.toasts.length >= maxToasts) {
      dispatch({ type: 'REMOVE_TOAST', id: state.toasts[0].id });
    }
    
    return id;
  }, [defaultDuration, defaultSize, defaultShowProgress, maxToasts, state.toasts.length]);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<ToastProps>) => {
    dispatch({ type: 'UPDATE_TOAST', id, updates });
  }, []);

  const clearToasts = useCallback(() => {
    dispatch({ type: 'CLEAR_TOASTS' });
  }, []);

  const setPlacement = useCallback((placement: ToastPlacement) => {
    dispatch({ type: 'SET_PLACEMENT', placement });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        show: addToast,
        update: updateToast,
        clear: clearToasts,
        setPlacement,
      }}
    >
      {children}
      <ToastContainer placement={state.placement} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default Toast; 