import React from 'react';

export interface LinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Link: React.FC<LinkProps> = ({
  href,
  children,
  variant = 'default',
  className = '',
  target,
  rel,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-block transition-colors duration-200';
  const variantStyles = {
    default: 'text-blue-600 hover:text-blue-800 underline',
    primary: 'text-primary-600 hover:text-primary-800 font-medium underline',
    secondary: 'text-gray-600 hover:text-gray-800 no-underline hover:underline'
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
  };

  return (
    <a
      href={href}
      className={combinedClassName}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : rel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link; 