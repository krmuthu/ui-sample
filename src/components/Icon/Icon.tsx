import React from 'react';
import clsx from 'clsx';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type IconAnimation = 'spin' | 'pulse' | 'bounce' | 'ping';

// Built-in icon names
export type IconName = 
  | 'close' 
  | 'user' 
  | 'settings' 
  | 'check' 
  | 'chevron-right' 
  | 'chevron-left'
  | 'chevron-up'
  | 'chevron-down'
  | 'plus'
  | 'minus'
  | 'search'
  | 'trash'
  | 'edit'
  | 'info';

// Built-in SVG paths
const iconPaths: Record<IconName, React.ReactNode> = {
  close: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  ),
  user: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  ),
  settings: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </>
  ),
  check: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  ),
  'chevron-right': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5l7 7-7 7"
    />
  ),
  'chevron-left': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19l-7-7 7-7"
    />
  ),
  'chevron-up': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 15l7-7 7 7"
    />
  ),
  'chevron-down': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 9l-7 7-7-7"
    />
  ),
  plus: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4v16m8-8H4"
    />
  ),
  minus: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 12H4"
    />
  ),
  search: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  ),
  trash: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  ),
  edit: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  ),
  info: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
};

export interface IconProps {
  /**
   * The name of the built-in icon to use, or a custom icon component
   */
  icon: IconName | React.ComponentType<{ className?: string; strokeWidth?: number; fill?: string }>;
  
  /**
   * The size of the icon
   * @default 'md'
   */
  size?: IconSize;
  
  /**
   * Custom class name for the icon
   */
  className?: string;
  
  /**
   * The color of the icon (stroke color)
   */
  color?: string;
  
  /**
   * The fill color of the icon (for filled icons)
   */
  fill?: string;
  
  /**
   * The stroke width of the icon
   * @default 2
   */
  strokeWidth?: number;
  
  /**
   * The rotation angle in degrees
   */
  rotate?: number;
  
  /**
   * The animation to apply to the icon
   */
  animation?: IconAnimation;
  
  /**
   * Accessibility label for the icon
   */
  'aria-label'?: string;
}

const sizeClasses: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
};

const animationClasses: Record<IconAnimation, string> = {
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
};

export const Icon: React.FC<IconProps> = ({
  icon,
  size = 'md',
  className = '',
  color,
  fill = 'none',
  strokeWidth = 2,
  rotate,
  animation,
  'aria-label': ariaLabel,
}) => {
  const classes = clsx(
    sizeClasses[size],
    color && `text-${color}`,
    fill && fill !== 'none' && `fill-${fill}`,
    rotate && `rotate-${rotate}`,
    animation && animationClasses[animation],
    className
  );

  // If icon is a string (name of built-in icon)
  if (typeof icon === 'string') {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        className={classes}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={fill}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={classes}
        >
          {iconPaths[icon]}
        </svg>
      </span>
    );
  }

  // If icon is a custom component
  const IconComponent = icon;
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={classes}
    >
      <IconComponent
        className={classes}
        strokeWidth={strokeWidth}
        fill={fill}
      />
    </span>
  );
}; 