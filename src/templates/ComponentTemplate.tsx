import React from 'react';

/**
 * Props for the ComponentTemplate component
 * @interface ComponentTemplateProps
 */
export interface ComponentTemplateProps {
  /**
   * Primary content or children to render
   */
  children?: React.ReactNode;
  
  /**
   * The visual variant of the component
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * The size of the component
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether the component should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * ComponentTemplate - A template for creating new components in the Clipper UI library
 * 
 * This provides a standardized starting point with proper TypeScript types,
 * props documentation, and styling patterns.
 * 
 * @example
 * ```tsx
 * <ComponentTemplate variant="primary" size="medium">
 *   Content goes here
 * </ComponentTemplate>
 * ```
 */
export const ComponentTemplate = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  onClick,
  ...rest
}: ComponentTemplateProps) => {
  // Build CSS classes based on props
  const sizeClasses = {
    small: 'p-2 text-sm',
    medium: 'p-3 text-base',
    large: 'p-4 text-lg',
  };
  
  const variantClasses = {
    primary: 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]',
    secondary: 'bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)]',
    tertiary: 'bg-[var(--btn-tertiary-bg)] text-[var(--btn-tertiary-text)]',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const componentClasses = [
    'rounded-md transition-colors duration-200',
    sizeClasses[size],
    variantClasses[variant],
    widthClass,
    className,
  ].join(' ');
  
  return (
    <div 
      className={componentClasses}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

export default ComponentTemplate; 