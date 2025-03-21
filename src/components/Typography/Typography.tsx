import React from 'react';

export type TypographyVariant =
  | 'display1'
  | 'display2'
  | 'headline1'
  | 'headline2'
  | 'headline3'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'body1'
  | 'body2'
  | 'label1'
  | 'label2';

export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TypographyColor = 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'subtle';
export type TypographyAlign = 'left' | 'center' | 'right';
export type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';

export interface TypographyProps {
  /**
   * The variant of the typography component
   * @default 'body1'
   */
  variant?: TypographyVariant;
  
  /**
   * The font weight to apply
   */
  weight?: TypographyWeight;
  
  /**
   * The HTML element to render
   * If not specified, it will be determined based on the variant
   */
  as?: TypographyElement;
  
  /**
   * Text color variation
   * @default 'default'
   */
  color?: TypographyColor;
  
  /**
   * Text alignment
   * @default 'left'
   */
  align?: TypographyAlign;
  
  /**
   * Whether to truncate text with ellipsis when it overflows
   * @default false
   */
  truncate?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * The content to render
   */
  children: React.ReactNode;
}

/**
 * Typography component for consistent text styling across the UI
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  weight,
  as,
  color = 'default',
  align = 'left',
  truncate = false,
  className = '',
  children,
  ...props
}) => {
  // Determine HTML element based on variant if not explicitly set
  const element = as || getDefaultElement(variant);
  
  // Combine all the classes
  const classes = `${getVariantClasses(variant, weight)} ${getColorClasses(color)} ${getAlignClasses(align)} ${truncate ? 'truncate' : ''} ${className}`.trim();
  
  return React.createElement(
    element,
    {
      className: classes,
      ...props
    },
    children
  );
};

/**
 * Get the default HTML element based on the typography variant
 */
function getDefaultElement(variant: TypographyVariant): TypographyElement {
  switch (variant) {
    case 'display1':
    case 'display2':
      return 'h1';
    case 'headline1':
      return 'h1';
    case 'headline2':
      return 'h2';
    case 'headline3':
      return 'h3';
    case 'title1':
      return 'h4';
    case 'title2':
      return 'h5';
    case 'title3':
      return 'h6';
    case 'body1':
    case 'body2':
      return 'p';
    case 'label1':
    case 'label2':
      return 'span';
    default:
      return 'p';
  }
}

/**
 * Generate the Tailwind classes for the typography variant and weight
 */
function getVariantClasses(variant: TypographyVariant, weight?: TypographyWeight): string {
  let classes = '';
  
  // Base font size and line height by variant
  switch (variant) {
    case 'display1':
      classes = 'text-5xl leading-tight';
      break;
    case 'display2':
      classes = 'text-4xl leading-tight';
      break;
    case 'headline1':
      classes = 'text-3xl leading-tight';
      break;
    case 'headline2':
      classes = 'text-2xl leading-tight';
      break;
    case 'headline3':
      classes = 'text-xl leading-tight';
      break;
    case 'title1':
      classes = 'text-lg leading-snug';
      break;
    case 'title2':
      classes = 'text-base leading-snug';
      break;
    case 'title3':
      classes = 'text-sm leading-snug';
      break;
    case 'body1':
      classes = 'text-base leading-normal';
      break;
    case 'body2':
      classes = 'text-sm leading-normal';
      break;
    case 'label1':
      classes = 'text-sm leading-tight';
      break;
    case 'label2':
      classes = 'text-xs leading-tight';
      break;
    default:
      classes = 'text-base leading-normal';
  }
  
  // Default weights by variant if not explicitly set
  if (!weight) {
    if (variant.startsWith('display') || variant.startsWith('headline')) {
      weight = 'bold';
    } else if (variant.startsWith('title')) {
      weight = 'semibold';
    } else if (variant.startsWith('label')) {
      weight = 'medium';
    } else {
      weight = 'regular';
    }
  }
  
  // Font weight
  switch (weight) {
    case 'regular':
      classes += ' font-normal';
      break;
    case 'medium':
      classes += ' font-medium';
      break;
    case 'semibold':
      classes += ' font-semibold';
      break;
    case 'bold':
      classes += ' font-bold';
      break;
  }
  
  return classes;
}

/**
 * Generate the color classes
 */
function getColorClasses(color: TypographyColor): string {
  switch (color) {
    case 'default':
      return 'text-gray-900';
    case 'primary':
      return 'text-blue-600';
    case 'secondary':
      return 'text-purple-600';
    case 'error':
      return 'text-red-600';
    case 'success':
      return 'text-green-600';
    case 'warning':
      return 'text-amber-500';
    case 'info':
      return 'text-sky-500';
    case 'subtle':
      return 'text-gray-500';
    default:
      return 'text-gray-900';
  }
}

/**
 * Generate the alignment classes
 */
function getAlignClasses(align: TypographyAlign): string {
  switch (align) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
}

export default Typography; 