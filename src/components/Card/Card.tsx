import React from 'react';

export interface CardProps {
  /**
   * The content of the card
   */
  children: React.ReactNode;
  
  /**
   * The title of the card
   */
  title?: React.ReactNode;
  
  /**
   * The subtitle of the card
   */
  subtitle?: React.ReactNode;
  
  /**
   * The footer content of the card
   */
  footer?: React.ReactNode;
  
  /**
   * Whether the card is loading
   */
  isLoading?: boolean;
  
  /**
   * Whether the card is hoverable
   * @default false
   */
  hoverable?: boolean;
  
  /**
   * Whether the card has a border
   * @default true
   */
  bordered?: boolean;
  
  /**
   * Whether the card has padding
   * @default true
   */
  padded?: boolean;
  
  /**
   * Custom class name for the card
   */
  className?: string;
  
  /**
   * Custom class name for the card header
   */
  headerClassName?: string;
  
  /**
   * Custom class name for the card body
   */
  bodyClassName?: string;
  
  /**
   * Custom class name for the card footer
   */
  footerClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  isLoading = false,
  hoverable = false,
  bordered = true,
  padded = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  const cardClasses = [
    'bg-white rounded-lg shadow-sm',
    bordered && 'border border-gray-200',
    hoverable && 'transition-shadow duration-200 hover:shadow-md',
    className,
  ].filter(Boolean).join(' ');

  const headerClasses = [
    'px-6 py-4 border-b border-gray-200',
    headerClassName,
  ].filter(Boolean).join(' ');

  const bodyClasses = [
    padded && 'px-6 py-4',
    bodyClassName,
  ].filter(Boolean).join(' ');

  const footerClasses = [
    'px-6 py-4 border-t border-gray-200',
    footerClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {(title || subtitle) && (
        <div className={headerClasses}>
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}

      <div className={bodyClasses}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          children
        )}
      </div>

      {footer && (
        <div className={footerClasses}>
          {footer}
        </div>
      )}
    </div>
  );
}; 