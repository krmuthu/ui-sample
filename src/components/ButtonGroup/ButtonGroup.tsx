import React from 'react';
import { ButtonProps } from '../Button/Button';

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
  spacing?: 'none' | 'compact' | 'default' | 'loose';
  
  /**
   * Variant to apply to all child buttons
   * If provided, it will override individual button variants
   */
  variant?: ButtonProps['variant'];
  
  /**
   * Color to apply to all child buttons
   * If provided, it will override individual button colors
   */
  color?: ButtonProps['color'];
  
  /**
   * Size to apply to all child buttons
   * If provided, it will override individual button sizes
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
  color,
  size,
  fullWidth = false,
  connected = false,
  align = 'left',
  className = '',
  ...props
}) => {
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
  const spacingStyles = !connected ? {
    none: 'gap-0',
    compact: orientation === 'horizontal' ? 'gap-1' : 'gap-1',
    default: orientation === 'horizontal' ? 'gap-2' : 'gap-2',
    loose: orientation === 'horizontal' ? 'gap-4' : 'gap-3',
  } : {
    none: '',
    compact: '',
    default: '',
    loose: ''
  };
  
  // Add connected style
  if (connected) {
    baseStyles.push('overflow-hidden');
  }
  
  const combinedClassName = [
    ...baseStyles,
    spacingStyles[spacing],
    className
  ].filter(Boolean).join(' ');
  
  // Prepare children with appropriate styles and props
  const childrenCount = React.Children.count(children);
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      // Apply border radius adjustments for connected buttons
      let borderRadiusClasses = '';
      
      if (connected && childrenCount > 1) {
        if (orientation === 'horizontal') {
          if (index === 0) {
            borderRadiusClasses = 'rounded-r-none';
          } else if (index === childrenCount - 1) {
            borderRadiusClasses = 'rounded-l-none';
          } else {
            borderRadiusClasses = 'rounded-none';
          }
        } else { // vertical
          if (index === 0) {
            borderRadiusClasses = 'rounded-b-none';
          } else if (index === childrenCount - 1) {
            borderRadiusClasses = 'rounded-t-none';
          } else {
            borderRadiusClasses = 'rounded-none';
          }
        }
      }
      
      // Add negative margin to create the connected effect
      let marginClasses = '';
      if (connected && index > 0) {
        marginClasses = orientation === 'horizontal' ? '-ml-px' : '-mt-px';
      }
      
      // Combine the child's existing className with our new classes
      const childClassName = child.props.className || '';
      const newClassName = `${childClassName} ${borderRadiusClasses} ${marginClasses}`.trim();
      
      // Build the new props to pass to the child
      const newChildProps: EnhancedButtonProps = {
        ...(variant && { variant }),
        ...(color && { color }),
        ...(size && { size }),
        ...(fullWidth && { fullWidth }),
        className: newClassName,
      };
      
      return React.cloneElement(child, newChildProps);
    }
    return child;
  });
  
  return (
    <div className={combinedClassName} role="group" {...props}>
      {enhancedChildren}
    </div>
  );
};

export default ButtonGroup; 