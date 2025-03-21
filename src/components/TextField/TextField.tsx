import React, { forwardRef } from 'react';
import { FormLabel } from '../FormLabel/FormLabel';

/**
 * Props for the TextField component
 * @interface TextFieldProps
 */
export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text for the input field
   */
  label?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * The size of the text field
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The visual variant of the text field
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Left icon to display in the input
   */
  startIcon?: React.ReactNode;
  
  /**
   * Right icon to display in the input
   */
  endIcon?: React.ReactNode;
  
  /**
   * Whether the input shows an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * Error message to display
   */
  errorMessage?: string;
  
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the input should take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Additional CSS class names for the input element
   */
  inputClassName?: string;
  
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;
}

/**
 * TextField - A text input component
 * 
 * @example
 * ```tsx
 * <TextField 
 *   label="Email"
 *   placeholder="Enter your email"
 *   type="email"
 *   required
 * />
 * ```
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({
  label,
  helperText,
  size = 'medium',
  variant = 'primary',
  startIcon,
  endIcon,
  error = false,
  errorMessage,
  disabled = false,
  fullWidth = false,
  className = '',
  inputClassName = '',
  id,
  placeholder,
  required = false,
  ...rest
}, ref) => {
  // Generate a unique ID if none is provided
  const inputId = id || `text-field-${Math.random().toString(36).substring(2, 11)}`;
  
  // Size classes for container and input
  const containerSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };
  
  const inputSizeClasses = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-3 text-base',
    large: 'py-3 px-4 text-lg',
  };
  
  // Padding adjustments for icons
  const startIconPadding = startIcon ? 'pl-9' : '';
  const endIconPadding = endIcon ? 'pr-9' : '';
  
  // Separate text and border colors
  const variantTextClasses = {
    primary: 'text-[var(--foreground)]',
    secondary: 'text-[var(--btn-secondary-text)]',
    tertiary: 'text-[var(--btn-tertiary-text)]',
  };
  
  // Border classes - only applied when not in error state
  const variantBorderClasses = {
    primary: 'border-[var(--btn-primary-ring)]',
    secondary: 'border-[var(--btn-secondary-ring)]',
    tertiary: 'border-[var(--btn-tertiary-ring)]',
  };
  
  // Background classes
  const variantBgClasses = {
    primary: 'bg-[var(--background)]',
    secondary: 'bg-[var(--btn-secondary-bg)]',
    tertiary: 'bg-[var(--btn-tertiary-bg)]',
  };
  
  // Focus ring classes
  const focusRingClasses = {
    primary: 'focus:ring-[var(--btn-primary-ring)]',
    secondary: 'focus:ring-[var(--btn-secondary-ring)]',
    tertiary: 'focus:ring-[var(--btn-tertiary-ring)]',
  };
  
  // Placeholder color classes
  const placeholderClasses = {
    primary: 'placeholder-[var(--btn-secondary-text)] placeholder-opacity-60',
    secondary: 'placeholder-[var(--btn-secondary-text)] placeholder-opacity-60',
    tertiary: 'placeholder-[var(--btn-tertiary-text)] placeholder-opacity-60',
  };
  
  // Error state styling - using standard Tailwind classes for better compatibility
  const errorClass = error 
    ? 'border-2 border-red-500' 
    : '';
    
  // Disabled state
  const disabledClass = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-text';
    
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes for the input
  const inputClasses = [
    'block rounded-md border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    inputSizeClasses[size],
    variantTextClasses[variant],
    error ? '' : variantBorderClasses[variant], // Only apply variant border when not in error state
    variantBgClasses[variant],
    focusRingClasses[variant],
    placeholderClasses[variant],
    errorClass,
    disabledClass,
    widthClass,
    startIconPadding,
    endIconPadding,
    inputClassName,
  ].join(' ');
  
  // Container classes
  const containerClasses = [
    'inline-block',
    containerSizeClasses[size],
    widthClass,
    className,
  ].join(' ');
  
  // Helper text classes - using standard Tailwind classes for better compatibility
  const helperTextClasses = [
    'mt-1 text-sm',
    error 
    ? 'text-[var(--btn-primary-negative-bg)] font-medium' 
      : 'text-[var(--btn-secondary-text)]',
    disabled ? 'opacity-50' : '',
  ].join(' ');

  return (
    <div className={containerClasses}>
      {/* Use FormLabel component for the label */}
      {label && (
        <FormLabel 
          htmlFor={inputId} 
          required={required} 
          disabled={disabled} 
          size={size}
          error={error}
        >
          {label}
        </FormLabel>
      )}
      
      {/* Input container with icons */}
      <div className="relative">
        {/* Start Icon */}
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`${error ? 'text-[var(--btn-primary-negative-bg)]' : 'text-[var(--foreground)]'} opacity-70`}>
              {startIcon}
            </span>
          </div>
        )}
        
        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={
            (helperText || errorMessage) ? `${inputId}-description` : undefined
          }
          required={required}
          {...rest}
        />
        
        {/* End Icon */}
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={`${error ? 'text-red-500' : 'text-[var(--foreground)]'} opacity-70`}>
              {endIcon}
            </span>
          </div>
        )}
      </div>
      
      {/* Helper or Error text */}
      {(helperText || (error && errorMessage)) && (
        <p 
          id={`${inputId}-description`} 
          className={helperTextClasses}
        >
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';