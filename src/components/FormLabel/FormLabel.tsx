import React from 'react';

/**
 * Props for the FormLabel component
 * @interface FormLabelProps
 */
export interface FormLabelProps {
  /**
   * ID of the input element this label is associated with
   */
  htmlFor: string;
  
  /**
   * The label text to display
   */
  children: React.ReactNode;
  
  /**
   * Whether the associated field is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Whether the label should be disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the associated field has an error
   * @default false
   */
  error?: boolean;
  
  /**
   * The size of the label
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * FormLabel - A reusable label component for form elements
 * 
 * @example
 * ```tsx
 * <FormLabel htmlFor="email" required>
 *   Email Address
 * </FormLabel>
 * ```
 */
export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  children,
  required = false,
  disabled = false,
  size = 'medium',
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };
  
  // Label classes - using standard Tailwind classes for better compatibility
  const labelClasses = [
    'block font-medium mb-1',
    'text-[var(--foreground)]', // Keep text color consistent
    sizeClasses[size],
    disabled ? 'opacity-50' : '',
    className,
  ].join(' ');

  return (
    <label htmlFor={htmlFor} className={labelClasses}>
      {children}
      {required && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </label>
  );
};

export default FormLabel; 