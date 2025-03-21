import React, { useState, HTMLAttributes } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The source URL for the avatar image
   */
  src?: string;
  
  /**
   * Alternative text for the avatar image
   */
  alt?: string;
  
  /**
   * The size of the avatar
   * @default 'medium'
   */
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  
  /**
   * The shape of the avatar
   * @default 'circle'
   */
  shape?: 'circle' | 'rounded' | 'square';
  
  /**
   * Initials to display when no image is available
   */
  initials?: string;
  
  /**
   * Name of the person (used to generate initials if none provided)
   */
  name?: string;
  
  /**
   * Background color for the avatar when displaying initials
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'neutral';
  
  /**
   * Status indicator
   */
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  
  /**
   * Whether to show a border around the avatar
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Avatar component for displaying user profile images with fallback to initials
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'medium',
  shape = 'circle',
  initials,
  name,
  color = 'primary',
  status = 'none',
  bordered = false,
  className = '',
  ...props
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Generate initials from name if none provided
  const derivedInitials = initials || (name ? getInitialsFromName(name) : '');
  
  // Size styles
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  
  // Shape styles
  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-md',
    square: 'rounded-none',
  };
  
  // Color styles for the background when showing initials
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    error: 'bg-error-100 text-error-800',
    warning: 'bg-warning-100 text-warning-800',
    neutral: 'bg-neutral-100 text-neutral-800',
  };
  
  // Status indicator styles
  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-neutral-300',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
    none: 'hidden',
  };
  
  // Border styles
  const borderClass = bordered ? 'border-2 border-white dark:border-neutral-800' : '';
  
  // Combine all the classes
  const avatarClasses = [
    'inline-flex items-center justify-center overflow-hidden flex-shrink-0',
    sizeClasses[size],
    shapeClasses[shape],
    !src || imgError ? colorClasses[color] : '',
    borderClass,
    'relative',
    className,
  ].filter(Boolean).join(' ');
  
  // Status indicator size based on avatar size
  const statusSize = {
    xs: 'w-1.5 h-1.5',
    small: 'w-2 h-2',
    medium: 'w-2.5 h-2.5',
    large: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };
  
  return (
    <div className={avatarClasses} {...props}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-medium uppercase">{derivedInitials}</span>
      )}
      
      {status !== 'none' && (
        <span 
          className={`absolute bottom-0 right-0 ${statusClasses[status]} ${statusSize[size]} rounded-full ring-2 ring-white dark:ring-neutral-800`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

/**
 * Helper function to generate initials from a name
 */
function getInitialsFromName(name: string): string {
  if (!name) return '';
  
  // Split the name into parts and take first letter of first two parts
  const parts = name.split(' ').filter(Boolean);
  
  if (parts.length === 1) {
    // If only one name, take the first two letters
    return parts[0].substring(0, 2).toUpperCase();
  } else {
    // Take first letter of first and last parts
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}