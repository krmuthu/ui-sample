import React from 'react';

type ButtonVariant = 'primary' | 'primary-positive' | 'primary-negative' | 'secondary' | 'tertiary' | 'tertiary-negative';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant style of the button.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Alternative name for variant. Has the same effect as variant but allows for more semantic API.
   * If both are provided, buttonType takes precedence.
   * @default 'primary'
   */
  buttonType?: ButtonVariant;
  
  /**
   * The size of the button.
   * @default 'standard'
   */
  size?: 'standard' | 'small';
  
  /**
   * Whether the button should take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether the button is in a loading state.
   * @default false
   */
  loading?: boolean;
  
  /**
   * Icon to display at the start of the button.
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display at the end of the button.
   */
  endIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  buttonType,
  size = 'standard',
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
  // Use buttonType if provided, otherwise use variant
  const effectiveVariant = buttonType || variant;
  
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
    standard: 'text-sm py-2 px-4 gap-2',
  };
  
  // Theme-aware variant style definitions using CSS variables
  const variantClasses = {
    'primary': `bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] shadow-sm focus:ring-[var(--btn-primary-ring)]`,
    'primary-positive': `bg-[var(--btn-primary-positive-bg)] hover:bg-[var(--btn-primary-positive-hover)] text-[var(--btn-primary-positive-text)] shadow-sm focus:ring-[var(--btn-primary-positive-ring)]`,
    'primary-negative': `bg-[var(--btn-primary-negative-bg)] hover:bg-[var(--btn-primary-negative-hover)] text-[var(--btn-primary-negative-text)] shadow-sm focus:ring-[var(--btn-primary-negative-ring)]`,
    'secondary': `bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] text-[var(--btn-secondary-text)] shadow-sm focus:ring-[var(--btn-secondary-ring)] border border-[var(--btn-secondary-border)]`,
    'tertiary': `bg-[var(--btn-tertiary-bg)] hover:bg-[var(--btn-tertiary-hover)] text-[var(--btn-tertiary-text)] focus:ring-[var(--btn-tertiary-ring)]`,
    'tertiary-negative': `bg-[var(--btn-tertiary-negative-bg)] hover:bg-[var(--btn-tertiary-negative-hover)] text-[var(--btn-tertiary-negative-text)] focus:ring-[var(--btn-tertiary-negative-ring)]`,
  };
  
  // Full width style
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Loading state
  const loadingClass = loading ? 'relative !text-transparent' : '';
  
  // Combine all classes
  const buttonClasses = [
    baseStyle,
    sizeClasses[size],
    variantClasses[effectiveVariant],
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