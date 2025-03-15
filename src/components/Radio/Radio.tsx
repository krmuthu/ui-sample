import React, { forwardRef } from 'react';
import { FormLabel } from '../FormLabel/FormLabel';

/**
 * Props for the Radio component
 * @interface RadioProps
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text for the radio input
   */
  label?: string;
  
  /**
   * The size of the radio button
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The visual variant of the radio button
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Whether the radio button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the radio button shows an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * Error message to display
   */
  errorMessage?: string;
  
  /**
   * Helper text to display below the radio button
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
   * Layout alignment of the label relative to the radio button
   * @default "end"
   */
  labelPlacement?: 'start' | 'end';
  
  /**
   * Data attribute for testing
   */
  'data-testid'?: string;
}

/**
 * Radio - A radio button input component
 * 
 * @example
 * ```tsx
 * <Radio
 *   label="Option 1"
 *   name="options"
 *   value="option1"
 *   checked={selectedOption === 'option1'}
 *   onChange={handleOptionChange}
 * />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  error = false,
  errorMessage,
  helperText,
  className = '',
  required = false,
  labelPlacement = 'end',
  id,
  name,
  value,
  checked,
  onChange,
  'data-testid': dataTestId,
  ...rest
}, ref) => {
  // Generate a unique ID if none is provided
  const inputId = id || `radio-${Math.random().toString(36).substring(2, 11)}`;
  
  // Size classes
  const containerSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };
  
  // Radio button size
  const radioSizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6',
  };
  
  // Variant classes for the radio button - separate text and border
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
    ? 'border-2 border-red-500' 
    : '';
  
  // Container classes
  const containerClasses = [
    'flex items-center',
    labelPlacement === 'start' ? 'flex-row-reverse justify-end' : '',
    containerSizeClasses[size],
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].join(' ');
  
  // Radio input classes
  const radioClasses = [
    'form-radio border-[var(--border)]',
    radioSizeClasses[size],
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
          ref={ref}
          id={inputId}
          type="radio"
          name={name}
          value={value}
          className={radioClasses}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          aria-describedby={
            (helperText || errorMessage) ? `${inputId}-description` : undefined
          }
          required={required}
          data-testid={dataTestId}
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

Radio.displayName = 'Radio';

export default Radio; 