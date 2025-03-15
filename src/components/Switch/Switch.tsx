import React, { forwardRef } from 'react';
import { FormLabel } from '../FormLabel/FormLabel';

/**
 * Props for the Switch component
 * @interface SwitchProps
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text for the switch input
   */
  label?: string;
  
  /**
   * The size of the switch
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The visual variant of the switch
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Whether the switch is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Helper text to display below the switch
   */
  helperText?: string;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Layout alignment of the label relative to the switch
   * @default "end"
   */
  labelPlacement?: 'start' | 'end';
  
  /**
   * Data attribute for testing
   */
  'data-testid'?: string;
}

/**
 * Switch - A toggle switch component
 * 
 * @example
 * ```tsx
 * <Switch
 *   label="Dark Mode"
 *   checked={isDarkMode}
 *   onChange={handleThemeChange}
 * />
 * ```
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  helperText,
  className = '',
  required = false,
  labelPlacement = 'end',
  id,
  checked,
  onChange,
  'data-testid': dataTestId,
  ...rest
}, ref) => {
  // Generate a unique ID if none is provided
  const inputId = id || `switch-${Math.random().toString(36).substring(2, 11)}`;
  
  // Size classes for container
  const containerSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };
  
  // Switch track sizes
  const trackSizeClasses = {
    small: 'h-4 w-8',
    medium: 'h-5 w-10',
    large: 'h-6 w-12',
  };
  
  // Switch thumb sizes
  const thumbSizeClasses = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4',
    large: 'h-5 w-5',
  };
  
  // Switch thumb positions
  const thumbPositionClasses = {
    small: 'translate-x-4',
    medium: 'translate-x-5',
    large: 'translate-x-6',
  };
  
  // Variant classes for the switch track
  const trackVariantClasses = {
    primary: 'bg-[var(--btn-primary-bg)]',
    secondary: 'bg-[var(--btn-secondary-bg)]',
    tertiary: 'bg-[var(--btn-tertiary-bg)]',
  };
  
  // Variant classes for the switch thumb
  const thumbVariantClasses = {
    primary: 'bg-white',
    secondary: 'bg-white',
    tertiary: 'bg-white',
  };
  
  // Container classes
  const containerClasses = [
    'flex items-center',
    labelPlacement === 'start' ? 'flex-row-reverse justify-end' : '',
    containerSizeClasses[size],
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].join(' ');
  
  // Track classes
  const trackClasses = [
    'relative inline-flex flex-shrink-0 rounded-full transition-colors ease-in-out duration-200 border-2 border-transparent',
    trackSizeClasses[size],
    checked ? trackVariantClasses[variant] : 'bg-[var(--border)]',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  ].join(' ');
  
  // Thumb classes
  const thumbClasses = [
    'inline-block transform rounded-full bg-white shadow transition ease-in-out duration-200',
    thumbSizeClasses[size],
    checked ? thumbPositionClasses[size] : 'translate-x-0',
    thumbVariantClasses[variant],
  ].join(' ');
  
  // Label spacing
  const labelSpacing = labelPlacement === 'start' ? 'mr-2' : 'ml-2';
  
  // Helper text classes
  const helperTextClasses = [
    'mt-1 text-sm',
    'text-[var(--btn-secondary-text)]',
    disabled ? 'opacity-50' : '',
  ].join(' ');

  return (
    <div className="flex flex-col">
      <div className={containerClasses}>
        {/* Hidden input for form submission and accessibility */}
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          aria-describedby={
            helperText ? `${inputId}-description` : undefined
          }
          required={required}
          data-testid={dataTestId}
          {...rest}
        />
        
        {/* Visual switch */}
        <label 
          htmlFor={inputId} 
          className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className={trackClasses}>
            <span className={thumbClasses} />
          </div>
        </label>
        
        {/* Label */}
        {label && (
          <FormLabel 
            htmlFor={inputId} 
            className={labelSpacing}
            required={required} 
            disabled={disabled}
            size={size}
          >
            {label}
          </FormLabel>
        )}
      </div>
      
      {/* Helper text */}
      {helperText && (
        <p 
          id={`${inputId}-description`} 
          className={helperTextClasses}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

export default Switch; 