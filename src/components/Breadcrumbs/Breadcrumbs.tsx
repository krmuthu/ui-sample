import React from 'react';

export interface BreadcrumbItem {
  /**
   * The label of the breadcrumb item
   */
  label: string;
  
  /**
   * The URL or path of the breadcrumb item
   */
  href?: string;
  
  /**
   * Whether the breadcrumb item is active
   */
  isActive?: boolean;
}

export interface BreadcrumbsProps {
  /**
   * The breadcrumb items
   */
  items: BreadcrumbItem[];
  
  /**
   * Custom class name for the breadcrumbs container
   */
  className?: string;
  
  /**
   * Custom class name for the breadcrumb items
   */
  itemClassName?: string;
  
  /**
   * Custom class name for the separator
   */
  separatorClassName?: string;
  
  /**
   * Custom separator between items
   * @default '/'
   */
  separator?: React.ReactNode;
  
  /**
   * Whether to show the home icon for the first item
   * @default true
   */
  showHomeIcon?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  itemClassName = '',
  separatorClassName = '',
  separator = '/',
  showHomeIcon = true,
}) => {
  if (!items.length) return null;

  return (
    <nav
      role="navigation"
      aria-label="breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && (
            <span
              className={`mx-2 text-gray-400 ${separatorClassName}`}
              aria-hidden="true"
            >
              {separator}
            </span>
          )}
          {item.isActive ? (
            <span
              className={`text-gray-500 font-medium ${itemClassName}`}
              aria-current="page"
            >
              {index === 0 && showHomeIcon ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  {item.label}
                </span>
              ) : (
                item.label
              )}
            </span>
          ) : (
            <a
              href={item.href}
              className={`text-blue-600 hover:text-blue-800 ${itemClassName}`}
            >
              {index === 0 && showHomeIcon ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  {item.label}
                </span>
              ) : (
                item.label
              )}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}; 