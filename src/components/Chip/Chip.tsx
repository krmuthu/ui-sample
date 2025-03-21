import React from 'react';
import { Tag, TagProps, TagColor, TagVariant, TagSize } from '../Tag';

// Re-export types from Tag with 'Chip' prefix
export type ChipColor = TagColor;
export type ChipVariant = TagVariant;
export type ChipSize = TagSize;

export interface ChipProps extends Omit<TagProps, 'text' | 'hasHashPrefix' | 'isLink' | 'href'> {
  /**
   * The text content of the chip
   */
  label: string;
  
  /**
   * Whether the chip is interactive (clickable)
   * @default false
   */
  interactive?: boolean;
  
  /**
   * Whether the chip is removable (has a remove button)
   * @default false
   */
  removable?: boolean;
  
  /**
   * Callback when the remove button is clicked
   */
  onRemove?: () => void;
  
  /**
   * Whether the chip is disabled
   * @default false
   */
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'soft',
  size = 'md',
  color = 'neutral',
  icon,
  interactive = false,
  removable = false,
  onRemove,
  disabled = false,
  onClick,
  className = '',
  ...restProps
}) => {
  // Handle click events
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!disabled && interactive && onClick) {
      onClick(e);
    }
  };
  
  // Handle remove button click
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!disabled && onRemove) {
      onRemove();
    }
  };
  
  // Additional classes for interactive and disabled states
  const interactiveClass = interactive && !disabled ? 'cursor-pointer hover:opacity-80' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const combinedClassName = `${className} ${interactiveClass} ${disabledClass}`.trim();
  
  return (
    <Tag
      text={label}
      variant={variant}
      size={size}
      color={color}
      icon={icon}
      onClick={handleClick}
      className={combinedClassName}
      aria-disabled={disabled}
      {...restProps}
    >
      {removable && (
        <button
          type="button"
          className="ml-1 text-current opacity-70 hover:opacity-100 focus:outline-none"
          onClick={handleRemove}
          disabled={disabled}
          aria-label="Remove"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3.5 w-3.5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      )}
    </Tag>
  );
};

export default Chip; 