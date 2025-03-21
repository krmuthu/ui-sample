import React from 'react';

// Base color, variant and size types
export type TagColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
export type TagVariant = 'filled' | 'outlined' | 'soft';
export type TagSize = 'sm' | 'md' | 'lg';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The text content of the tag
   */
  text: string;
  
  /**
   * The visual style variant of the tag
   * @default 'soft'
   */
  variant?: TagVariant;
  
  /**
   * The size of the tag
   * @default 'sm'
   */
  size?: TagSize;
  
  /**
   * The color scheme of the tag
   * @default 'neutral'
   */
  color?: TagColor;
  
  /**
   * Whether to show a hash symbol (#) before the text
   * @default false
   */
  hasHashPrefix?: boolean;
  
  /**
   * Whether the tag should be rendered as a link
   * @default false
   */
  isLink?: boolean;
  
  /**
   * The URL the tag should link to (required if isLink is true)
   */
  href?: string;
  
  /**
   * Optional icon to display at the start of the tag
   */
  icon?: React.ReactNode;
  
  /**
   * Custom CSS class name
   */
  className?: string;
  
  /**
   * Optional children to render after the text
   */
  children?: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({
  text,
  variant = 'soft',
  size = 'sm',
  color = 'neutral',
  hasHashPrefix = false,
  isLink = false,
  href,
  icon,
  className = '',
  children,
  onClick,
  ...restProps
}) => {
  // Prepare the label with optional hash prefix
  const displayText = hasHashPrefix ? `#${text}` : text;
  
  // Base tag classes including text styling
  const baseClasses = getTagClasses(variant, size, color);
  const combinedClasses = `${baseClasses} ${className}`.trim();
  
  // Add text size based on tag size
  const textSizeClass = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';
  
  // Render content with optional icon
  const content = (
    <>
      {icon && <span className="mr-1 flex items-center">{icon}</span>}
      <span className={textSizeClass}>
        {displayText}
      </span>
      {children}
    </>
  );
  
  // If it's a link and href is provided, render as anchor
  if (isLink && href) {
    return (
      <a 
        href={href}
        className={`inline-flex items-center no-underline ${combinedClasses}`}
        onClick={onClick}
        {...restProps}
      >
        {content}
      </a>
    );
  }
  
  // Otherwise render as span
  return (
    <span
      className={`inline-flex items-center ${combinedClasses}`}
      onClick={onClick}
      {...restProps}
    >
      {content}
    </span>
  );
};

// Helper function to generate classes based on variant, size and color
const getTagClasses = (variant: TagVariant, size: TagSize, color: TagColor): string => {
  // Base classes
  let classes = 'rounded-full font-medium';
  
  // Size classes
  if (size === 'sm') {
    classes += ' px-2 py-0.5';
  } else if (size === 'md') {
    classes += ' px-2.5 py-1';
  } else if (size === 'lg') {
    classes += ' px-3 py-1.5';
  }
  
  // Variant and color classes
  if (variant === 'filled') {
    if (color === 'primary') {
      classes += ' bg-blue-600 text-white';
    } else if (color === 'secondary') {
      classes += ' bg-purple-600 text-white';
    } else if (color === 'success') {
      classes += ' bg-green-600 text-white';
    } else if (color === 'danger') {
      classes += ' bg-red-600 text-white';
    } else if (color === 'warning') {
      classes += ' bg-amber-500 text-white';
    } else if (color === 'info') {
      classes += ' bg-sky-500 text-white';
    } else if (color === 'neutral') {
      classes += ' bg-gray-600 text-white';
    }
  } else if (variant === 'outlined') {
    classes += ' bg-transparent border';
    if (color === 'primary') {
      classes += ' border-blue-600 text-blue-600';
    } else if (color === 'secondary') {
      classes += ' border-purple-600 text-purple-600';
    } else if (color === 'success') {
      classes += ' border-green-600 text-green-600';
    } else if (color === 'danger') {
      classes += ' border-red-600 text-red-600';
    } else if (color === 'warning') {
      classes += ' border-amber-500 text-amber-500';
    } else if (color === 'info') {
      classes += ' border-sky-500 text-sky-500';
    } else if (color === 'neutral') {
      classes += ' border-gray-600 text-gray-600';
    }
  } else if (variant === 'soft') {
    if (color === 'primary') {
      classes += ' bg-blue-100 text-blue-800';
    } else if (color === 'secondary') {
      classes += ' bg-purple-100 text-purple-800';
    } else if (color === 'success') {
      classes += ' bg-green-100 text-green-800';
    } else if (color === 'danger') {
      classes += ' bg-red-100 text-red-800';
    } else if (color === 'warning') {
      classes += ' bg-amber-100 text-amber-800';
    } else if (color === 'info') {
      classes += ' bg-sky-100 text-sky-800';
    } else if (color === 'neutral') {
      classes += ' bg-gray-100 text-gray-800';
    }
  }
  
  return classes;
};

export default Tag; 