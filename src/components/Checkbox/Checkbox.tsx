import React, { forwardRef } from 'react';
import { FormLabel } from '../FormLabel/FormLabel';

/**
 * Props for the Checkbox component
 * @interface CheckboxProps
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text for the checkbox input
   */
  label?: string;
  
  /**
   * The size of the checkbox
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The visual variant of the checkbox
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Whether the checkbox is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the checkbox shows an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * Error message to display
   */
  errorMessage?: string;
  
  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;
  
  /**
   * Whether the checkbox is in an indeterminate state
   * @default false
   */
  indeterminate?: boolean;
  
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
   * Layout alignment of the label relative to the checkbox
   * @default "end"
   */
  labelPlacement?: 'start' | 'end';
  
  /**
   * Data attribute for testing
   */
  'data-testid'?: string;
}

/**
 * Checkbox - A checkbox input component
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   label="Remember me"
 *   checked={remember}
 *   onChange={handleRememberChange}
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  error = false,
  errorMessage,
  helperText,
  indeterminate = false,
  className = '',
  required = false,
  labelPlacement = 'end',
  id,
  checked,
  onChange,
  'data-testid': dataTestId,
  ...rest
}, ref) => {
  // Handle the ref to set indeterminate property which isn't available as a prop
  const handleRef = (element: HTMLInputElement | null) => {
    if (element) {
      element.indeterminate = indeterminate;
      if (ref) {
        if (typeof ref === 'function') {
          ref(element);
        } else {
          (ref as React.MutableRefObject<HTMLInputElement>).current = element;
        }
      }
    }
  };
  
  // Generate a unique ID if none is provided
  const inputId = id || `checkbox-${Math.random().toString(36).substring(2, 11)}`;
  
  // Size classes
  const containerSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };
  
  // Checkbox size
  const checkboxSizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6',
  };
  
  // Variant classes for the checkbox - separate text and border
  const variantTextClasses = {
    primary: 'text-[var(--btn-primary-bg)]',
    secondary: 'text-[var(--btn-secondary-bg)]',
    tertiary: 'text-[var(--btn-tertiary-bg)]',
  };
  
  // Focus ring classes
  const focusRingClasses = {
    primary: 'focus:ring-[var(--btn-primary-ring)]',
    secondary: 'focus:ring-[var(--btn-secondary-ring)]',
    tertiary: 'focus:ring-[var(--btn-tertiary-ring)]',
  };
  
  // Error state styling - using standard Tailwind classes
  const errorClass = error 
    ? 'border-2 border-[var(--btn-primary-negative-text)]' 
    : '';
  
  // Container classes
  const containerClasses = [
    'flex items-center',
    labelPlacement === 'start' ? 'flex-row-reverse justify-end' : '',
    containerSizeClasses[size],
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].join(' ');
  
  // Checkbox input classes
  const checkboxClasses = [
    'form-checkbox rounded border-[var(--border)]',
    checkboxSizeClasses[size],
    variantTextClasses[variant],
    focusRingClasses[variant],
    errorClass,
    'focus:ring-2 focus:ring-offset-2',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  ].join(' ');
  
  // Label spacing
  const labelSpacing = labelPlacement === 'start' ? 'mr-2' : 'ml-2';
  
  // Helper text classes - using standard Tailwind classes
  const helperTextClasses = [
    'mt-1 text-sm',
    error 
      ? 'text-red-500' 
      : 'text-[var(--btn-secondary-text)]',
    disabled ? 'opacity-50' : '',
  ].join(' ');

  return (
    <div className="flex flex-col">
      <div className={containerClasses}>
        <input
          ref={handleRef}
          id={inputId}
          type="checkbox"
          className={checkboxClasses}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          aria-describedby={
            (helperText || errorMessage) ? `${inputId}-description` : undefined
          }
          required={required}
          data-testid={dataTestId}
          data-indeterminate={indeterminate}
          {...rest}
        />
        
        {label && (
          <FormLabel 
            htmlFor={inputId} 
            className={labelSpacing}
            required={required} 
            disabled={disabled}
            error={error}
            size={size}
          >
            {label}
          </FormLabel>
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

Checkbox.displayName = 'Checkbox';

export default Checkbox; 