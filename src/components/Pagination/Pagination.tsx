import React from 'react';
import { Button } from '../Button';

export interface PaginationProps {
  /**
   * The current page number (1-based)
   */
  currentPage: number;
  
  /**
   * The total number of pages
   */
  totalPages: number;
  
  /**
   * Callback when the page changes
   */
  onPageChange: (page: number) => void;
  
  /**
   * The number of page numbers to show before and after the current page
   * @default 2
   */
  pageRange?: number;
  
  /**
   * Whether to show the first and last page buttons
   * @default true
   */
  showFirstLast?: boolean;
  
  /**
   * Whether to show the previous and next page buttons
   * @default true
   */
  showPrevNext?: boolean;
  
  /**
   * Custom class name for the pagination container
   */
  className?: string;
  
  /**
   * The size of the pagination buttons
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageRange = 2,
  showFirstLast = true,
  showPrevNext = true,
  className = '',
  size = 'md',
}) => {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const start = Math.max(1, currentPage - pageRange);
    const end = Math.min(totalPages, currentPage + pageRange);

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-2 text-lg',
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={`flex items-center justify-center gap-1 ${className}`}
    >
      {showFirstLast && (
        <Button
          variant="secondary"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={buttonSizeClasses[size]}
        >
          <span className="sr-only">First page</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </Button>
      )}

      {showPrevNext && (
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={buttonSizeClasses[size]}
        >
          <span className="sr-only">Previous page</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>
      )}

      {getPageNumbers().map((page, index) => (
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className={`${buttonSizeClasses[size]} text-gray-500`}
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'secondary'}
            onClick={() => onPageChange(page)}
            className={buttonSizeClasses[size]}
          >
            {page}
          </Button>
        )
      ))}

      {showPrevNext && (
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={buttonSizeClasses[size]}
        >
          <span className="sr-only">Next page</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      )}

      {showFirstLast && (
        <Button
          variant="secondary"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={buttonSizeClasses[size]}
        >
          <span className="sr-only">Last page</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </Button>
      )}
    </nav>
  );
}; 