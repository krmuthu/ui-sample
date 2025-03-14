import React from 'react';
import { ButtonProps } from '../Button/Button';

// Define the type for spacing options
type SpacingType = 'none' | 'compact' | 'default' | 'loose';

export interface ButtonGroupProps {
  /**
   * The buttons to be rendered inside the group
   */
  children: React.ReactNode;
  
  /**
   * The orientation of the button group
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * The spacing between buttons
   * @default 'default'
   */
  spacing?: SpacingType;
  
  /**
   * Variant to apply to all child buttons
   * If provided, it will override individual button variants
   */
  variant?: ButtonProps['variant'];
  
  /**
   * Button type to apply to all child buttons
   * Alternative to 'variant' prop with same functionality but more semantic naming
   * If both are provided, buttonType takes precedence
   */
  buttonType?: ButtonProps['buttonType'];
  
  /**
   * Size to apply to all child buttons
   * If provided, it will override individual button sizes
   * @default 'standard'
   */
  size?: ButtonProps['size'];
  
  /**
   * If true, buttons will take up the full width of the container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * If true, buttons will be connected without gaps
   * @default false
   */
  connected?: boolean;
  
  /**
   * Horizontal alignment of buttons when using fullWidth
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right' | 'between' | 'around';
  
  /**
   * Additional CSS class names
   */
  className?: string;
}

// Type for enhanced button props
interface EnhancedButtonProps extends Partial<ButtonProps> {
  className?: string;
}

/**
 * ButtonGroup component for grouping related buttons with consistent styling
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'default',
  variant,
  buttonType,
  size = 'standard',
  fullWidth = false,
  connected = false,
  align = 'left',
  className = '',
  ...props
}) => {
  // Use buttonType if provided, otherwise use variant
  const effectiveVariant = buttonType || variant;
  
  // Base styles
  const baseStyles = [
    'inline-flex',
    orientation === 'horizontal' ? 'flex-row' : 'flex-col',
    fullWidth ? 'w-full' : '',
  ];
  
  // Alignment styles (only applicable when fullWidth is true)
  const alignmentStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };
  
  if (fullWidth) {
    baseStyles.push(alignmentStyles[align]);
  }
  
  // Spacing styles (only applied when not connected)
  const spacingStyles: Record<SpacingType, string> = {
    none: 'gap-0',
    compact: 'gap-1',
    default: 'gap-2',
    loose: 'gap-4'
  };
  
  // Add spacing class if not connected
  if (!connected) {
    baseStyles.push(spacingStyles[spacing]);
  }
  
  // Additional styles for connected buttons
  if (connected) {
    baseStyles.push('overflow-hidden');
  }
  
  // CSS class string
  const groupClasses = [...baseStyles, className].filter(Boolean).join(' ');

  // Count children for proper styling
  const childrenCount = React.Children.count(children);

  // Add variant, size, and connected styles to all buttons
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const childProps: EnhancedButtonProps = {};
      
      // Apply size and variant overrides
      if (size) childProps.size = size;
      if (effectiveVariant) childProps.variant = effectiveVariant;
      if (buttonType) childProps.buttonType = buttonType;
      
      // For connected buttons, add special styling
      if (connected && orientation === 'horizontal') {
        let className = '';
        if (index === 0) {
          className = 'rounded-r-none';
        } else if (index === childrenCount - 1) {
          className = 'rounded-l-none';
        } else {
          className = 'rounded-none';
        }
        childProps.className = className;
      } else if (connected && orientation === 'vertical') {
        let className = '';
        if (index === 0) {
          className = 'rounded-b-none';
        } else if (index === childrenCount - 1) {
          className = 'rounded-t-none';
        } else {
          className = 'rounded-none';
        }
        childProps.className = className;
      }
      
      // Add negative margin for connected effect
      if (connected && index > 0) {
        const marginDirection = orientation === 'horizontal' ? '-ml-px' : '-mt-px';
        childProps.className = `${childProps.className || ''} ${marginDirection}`.trim();
      }
      
      // Apply full width to children if the group is full width
      if (fullWidth) {
        childProps.fullWidth = true;
      }
      
      return React.cloneElement(child, childProps);
    }
    return child;
  });

  return (
    <div role="group" className={groupClasses} {...props}>
      {enhancedChildren}
    </div>
  );
};

export default ButtonGroup; 