import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  // Base styles for all buttons
  const baseStyle = [
    'font-medium rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-all duration-200',
    'inline-flex items-center justify-center',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'active:scale-[0.98] transform'
  ].join(' ');
  
  // Size variations
  const sizeClasses = {
    small: 'text-xs py-1.5 px-3 gap-1.5',
    medium: 'text-sm py-2 px-4 gap-2',
    large: 'text-base py-2.5 px-5 gap-2.5',
  };
  
  // Color and variant combinations
  const variantClasses = {
    contained: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm focus:ring-primary-500',
      secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm focus:ring-secondary-500',
      success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm focus:ring-success-500',
      error: 'bg-error-600 hover:bg-error-700 text-white shadow-sm focus:ring-error-500',
    },
    outlined: {
      primary: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-transparent',
      secondary: 'border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-50 focus:ring-secondary-500 bg-transparent',
      success: 'border-2 border-success-600 text-success-600 hover:bg-success-50 focus:ring-success-500 bg-transparent',
      error: 'border-2 border-error-600 text-error-600 hover:bg-error-50 focus:ring-error-500 bg-transparent',
    },
    text: {
      primary: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-transparent',
      secondary: 'text-secondary-600 hover:bg-secondary-50 focus:ring-secondary-500 bg-transparent',
      success: 'text-success-600 hover:bg-success-50 focus:ring-success-500 bg-transparent',
      error: 'text-error-600 hover:bg-error-50 focus:ring-error-500 bg-transparent',
    },
  };
  
  // Full width style
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Loading state
  const loadingClass = loading ? 'relative !text-transparent' : '';
  
  // Combine all classes
  const buttonClasses = [
    baseStyle,
    sizeClasses[size],
    variantClasses[variant][color],
    widthClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {startIcon && !loading && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {startIcon}
        </span>
      )}
      <span className="inline-flex items-center">{children}</span>
      {endIcon && !loading && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {endIcon}
        </span>
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </button>
  );
};

export default Button; 