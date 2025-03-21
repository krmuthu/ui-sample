import React from 'react';
import { Typography } from '../Typography';

export type BadgeVariant = 'default' | 'primary' | 'secondary';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /**
   * Optional ID for the component
   */
  id?: string;
  
  /**
   * Main content of the component
   */
  children?: React.ReactNode;
  
  /**
   * Visual variant of the component
   * @default 'default'
   */
  variant?: BadgeVariant;
  
  /**
   * Size of the component
   * @default 'md'
   */
  size?: BadgeSize;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Callback fired when the component is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  
  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

/**
 * Badge component for [brief description]
 * 
 * @example
 * ```tsx
 * <Badge variant="primary" size="md">Content</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  id,
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
  ...restProps
}) => {
  // Generate base classes based on variant and size
  const baseClasses = getBaseClasses(variant, size, disabled);
  const combinedClasses = `${baseClasses} ${className}`.trim();
  
  return (
    <div
      id={id}
      className={combinedClasses}
      onClick={!disabled ? onClick : undefined}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      role="region"
      {...restProps}
    >
      {typeof children === 'string' ? (
        <Typography variant={size === 'lg' ? 'body1' : 'body2'}>
          {children}
        </Typography>
      ) : (
        children
      )}
    </div>
  );
};

// Helper function to generate base classes
const getBaseClasses = (
  variant: BadgeVariant, 
  size: BadgeSize,
  disabled: boolean
): string => {
  let classes = '';
  
  // Variant classes
  switch (variant) {
    case 'primary':
      classes += 'bg-blue-100 text-blue-900 ';
      break;
    case 'secondary':
      classes += 'bg-gray-100 text-gray-900 ';
      break;
    default:
      classes += 'bg-white text-gray-800 ';
  }
  
  // Size classes
  switch (size) {
    case 'sm':
      classes += 'p-2 rounded ';
      break;
    case 'lg':
      classes += 'p-4 rounded-lg ';
      break;
    default:
      classes += 'p-3 rounded-md ';
  }
  
  // Disabled state
  if (disabled) {
    classes += 'opacity-60 cursor-not-allowed ';
  }
  
  return classes.trim();
};

export default Badge; 