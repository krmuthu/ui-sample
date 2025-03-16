import React, { useState, useEffect, CSSProperties } from 'react';
import './Table.css';

// Types and interfaces for the Table component
export type SortDirection = 'asc' | 'desc' | 'none';

export type ColumnAlignment = 'left' | 'center' | 'right';

export interface TableColumn<T> {
  /**
   * Unique identifier for the column
   */
  id: string;
  
  /**
   * Header text for the column
   */
  header: React.ReactNode;
  
  /**
   * Function to get the cell value for a row
   */
  accessor: keyof T | ((row: T, index: number) => React.ReactNode);
  
  /**
   * Cell alignment
   * @default "left"
   */
  align?: ColumnAlignment;
  
  /**
   * Width of the column
   */
  width?: string | number;
  
  /**
   * Whether the column is sortable
   * @default false
   */
  sortable?: boolean;
  
  /**
   * Custom cell renderer
   */
  cell?: (value: React.ReactNode, row: T, index: number) => React.ReactNode;
  
  /**
   * Custom header renderer
   */
  headerCell?: (column: TableColumn<T>) => React.ReactNode;
  
  /**
   * Whether the column is hidden
   * @default false
   */
  hidden?: boolean;
  
  /**
   * Whether the column is sticky
   * @default false
   */
  sticky?: boolean;
  
  /**
   * Whether the column should wrap content
   * @default true
   */
  wrap?: boolean;
  
  /**
   * Extra class name for the column header
   */
  headerClassName?: string;
  
  /**
   * Extra class name for the column cells
   */
  cellClassName?: string;
}

export interface TableProps<T extends Record<string, unknown>> {
  /**
   * Data to be displayed in the table
   */
  data: T[];
  
  /**
   * Column definitions
   */
  columns: TableColumn<T>[];
  
  /**
   * Whether the table should have zebra striping
   * @default true
   */
  striped?: boolean;
  
  /**
   * Whether the table should have borders
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Whether the table should be in a loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Custom loading component
   */
  loadingIndicator?: React.ReactNode;
  
  /**
   * Whether to enable hover effect on rows
   * @default true
   */
  hover?: boolean;
  
  /**
   * Whether the table should be responsive (horizontal scrolling on small screens)
   * @default true
   */
  responsive?: boolean;
  
  /**
   * Size of the table
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Visual variant of the table
   * @default "default"
   */
  variant?: 'default' | 'primary' | 'minimal';
  
  /**
   * Whether the table should have a sticky header
   * @default false
   */
  stickyHeader?: boolean;
  
  /**
   * Height of the table body when using stickyHeader
   */
  maxHeight?: string | number;
  
  /**
   * Message to show when no data is available
   * @default "No data available"
   */
  emptyMessage?: React.ReactNode;
  
  /**
   * Whether to enable row selection
   * @default false
   */
  selectable?: boolean;
  
  /**
   * Selected row keys
   */
  selectedRows?: string[] | number[];
  
  /**
   * Callback for row selection changes
   */
  onSelectChange?: (selectedRows: string[] | number[]) => void;
  
  /**
   * Key for row identity (used for selection)
   */
  rowKey?: keyof T | ((row: T) => string | number);
  
  /**
   * Callback for row click
   */
  onRowClick?: (row: T, index: number) => void;
  
  /**
   * Function to determine if a row is disabled
   */
  isRowDisabled?: (row: T, index: number) => boolean;
  
  /**
   * Custom row class name
   */
  rowClassName?: string | ((row: T, index: number) => string);
  
  /**
   * Whether to enable sorting
   * @default false
   */
  sortable?: boolean;
  
  /**
   * Default sort column
   */
  defaultSortColumn?: string;
  
  /**
   * Default sort direction
   * @default "asc"
   */
  defaultSortDirection?: SortDirection;
  
  /**
   * Controlled sort column
   */
  sortColumn?: string;
  
  /**
   * Controlled sort direction
   */
  sortDirection?: SortDirection;
  
  /**
   * Callback for sort changes
   */
  onSortChange?: (column: string, direction: SortDirection) => void;
  
  /**
   * Custom sort function
   */
  sortFunction?: (a: T, b: T, column: string, direction: SortDirection) => number;
  
  /**
   * Whether to enable pagination
   * @default false
   */
  pagination?: boolean;
  
  /**
   * Current page (1-based)
   * @default 1
   */
  currentPage?: number;
  
  /**
   * Number of rows per page
   * @default 10
   */
  pageSize?: number;
  
  /**
   * Total number of items (used for server-side pagination)
   */
  totalItems?: number;
  
  /**
   * Callback for page change
   */
  onPageChange?: (page: number) => void;
  
  /**
   * Page size options
   * @default [10, 25, 50, 100]
   */
  pageSizeOptions?: number[];
  
  /**
   * Callback for page size change
   */
  onPageSizeChange?: (pageSize: number) => void;
  
  /**
   * Additional table class name
   */
  className?: string;
  
  /**
   * Additional table head class name
   */
  headClassName?: string;
  
  /**
   * Additional table body class name
   */
  bodyClassName?: string;
  
  /**
   * Additional header row class name
   */
  headerRowClassName?: string;
  
  /**
   * Custom table wrapper render function
   */
  tableWrapper?: (table: React.ReactNode) => React.ReactNode;
  
  /**
   * Render a custom empty state
   */
  renderEmpty?: () => React.ReactNode;
  
  /**
   * Additional props to be spread to the table element
   */
  style?: CSSProperties;
  
  /**
   * HTMLTable attributes
   */
  [key: string]: unknown;
}

// Table header component
const TableHead = <T extends Record<string, unknown>>({
  columns,
  sortable,
  sortColumn,
  sortDirection,
  onSortChange,
  stickyHeader,
  headerRowClassName,
  headClassName,
}: {
  columns: TableColumn<T>[];
  sortable?: boolean;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSortChange?: (column: string, direction: SortDirection) => void;
  stickyHeader?: boolean;
  headerRowClassName?: string;
  headClassName?: string;
}) => {
  const handleSort = (column: TableColumn<T>) => {
    if (!sortable || !column.sortable || !onSortChange) return;
    
    let direction: SortDirection = 'asc';
    
    if (sortColumn === column.id) {
      direction = sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? 'none' : 'asc';
    }
    
    onSortChange(column.id, direction);
  };
  
  // Render sort indicator
  const renderSortIndicator = (column: TableColumn<T>) => {
    if (!sortable || !column.sortable) return null;
    
    const isSorted = sortColumn === column.id;
    
    return (
      <span className="ml-1 inline-flex">
        {isSorted && sortDirection === 'asc' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
        {isSorted && sortDirection === 'desc' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        {(!isSorted || sortDirection === 'none') && (
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        )}
      </span>
    );
  };
  
  // Get alignment class
  const getAlignmentClass = (align?: ColumnAlignment) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };
  
  const theadClasses = [
    'bg-[var(--table-header-bg)]',
    'text-[var(--table-header-text)]',
    stickyHeader ? 'sticky top-0 z-10' : '',
    headClassName
  ].filter(Boolean).join(' ');
  
  const headerRowClasses = [
    headerRowClassName
  ].filter(Boolean).join(' ');
  
  return (
    <thead className={theadClasses}>
      <tr className={headerRowClasses}>
        {columns.filter(col => !col.hidden).map((column) => {
          const cellClasses = [
            'px-4 py-3 font-semibold',
            'border-b border-[var(--table-border)]',
            column.sticky ? 'sticky left-0 z-20' : '',
            getAlignmentClass(column.align),
            column.headerClassName,
            sortable && column.sortable ? 'cursor-pointer select-none' : ''
          ].filter(Boolean).join(' ');
          
          return (
            <th 
              key={column.id}
              className={cellClasses}
              style={{
                width: column.width,
                minWidth: column.width,
                position: column.sticky ? 'sticky' : undefined,
                left: column.sticky ? 0 : undefined,
                background: column.sticky ? 'var(--table-header-bg)' : undefined
              }}
              onClick={() => handleSort(column)}
            >
              <div className="flex items-center gap-1">
                {column.headerCell ? column.headerCell(column) : column.header}
                {sortable && column.sortable && renderSortIndicator(column)}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

// Table body component
const TableBody = <T extends Record<string, unknown>>({
  data,
  columns,
  striped,
  hover,
  onRowClick,
  isRowDisabled,
  rowClassName,
  bodyClassName,
  emptyMessage,
  renderEmpty,
  loading,
}: {
  data: T[];
  columns: TableColumn<T>[];
  striped?: boolean;
  hover?: boolean;
  onRowClick?: (row: T, index: number) => void;
  isRowDisabled?: (row: T, index: number) => boolean;
  rowClassName?: string | ((row: T, index: number) => string);
  bodyClassName?: string;
  emptyMessage?: React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  loading?: boolean;
}) => {
  // Get alignment class
  const getAlignmentClass = (align?: ColumnAlignment) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };
  
  // Get cell value
  const getCellValue = (row: T, column: TableColumn<T>, index: number): React.ReactNode => {
    if (column.cell) {
      const value = typeof column.accessor === 'function'
        ? column.accessor(row, index)
        : row[column.accessor];
      
      return column.cell(value as React.ReactNode, row, index);
    }
    
    if (typeof column.accessor === 'function') {
      return column.accessor(row, index);
    }
    
    // Use toString() for primitive values or JSON.stringify for objects
    const rawValue = row[column.accessor];
    
    // Handle null and undefined
    if (rawValue === null || rawValue === undefined) {
      return '';
    }
    
    // Handle Date objects
    if (rawValue instanceof Date) {
      return rawValue.toLocaleString();
    }

    // For other types, convert to string as safely as possible
    if (typeof rawValue === 'object') {
      let stringValue = String(rawValue); // Default fallback
      try {
        stringValue = JSON.stringify(rawValue);
      } catch {
        // Use the default String() conversion if JSON.stringify fails
      }
      return stringValue;
    }
    
    return String(rawValue);
  };
  
  // Get row class name
  const getRowClassName = (row: T, index: number) => {
    const baseClasses = [
      'border-b border-[var(--table-border)]',
      hover ? 'hover:bg-[var(--table-hover-bg)]' : '',
      striped && index % 2 !== 0 ? 'bg-[var(--table-stripe-bg)]' : '',
      isRowDisabled && isRowDisabled(row, index) ? 'opacity-50 cursor-not-allowed' : '',
      onRowClick ? 'cursor-pointer' : ''
    ];
    
    if (typeof rowClassName === 'function') {
      return [...baseClasses, rowClassName(row, index)].filter(Boolean).join(' ');
    }
    
    return [...baseClasses, rowClassName].filter(Boolean).join(' ');
  };
  
  // Render empty state
  const renderEmptyState = () => {
    if (renderEmpty) {
      return renderEmpty();
    }
    
    return (
      <tr>
        <td 
          colSpan={columns.filter(col => !col.hidden).length}
          className="text-center py-8 px-4 text-[var(--table-empty-text)]"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin h-6 w-6 border-2 border-[var(--table-header-text)] border-t-transparent rounded-full" />
            </div>
          ) : (
            emptyMessage || 'No data available'
          )}
        </td>
      </tr>
    );
  };
  
  return (
    <tbody className={bodyClassName}>
      {data.length === 0 ? (
        renderEmptyState()
      ) : (
        data.map((row, rowIndex) => (
          <tr 
            key={rowIndex}
            className={getRowClassName(row, rowIndex)}
            onClick={() => onRowClick && !isRowDisabled?.(row, rowIndex) && onRowClick(row, rowIndex)}
          >
            {columns.filter(col => !col.hidden).map((column) => {
              const cellClasses = [
                'px-4 py-3',
                column.sticky ? 'sticky left-0 z-10' : '',
                getAlignmentClass(column.align),
                column.wrap === false ? 'whitespace-nowrap' : '',
                column.cellClassName
              ].filter(Boolean).join(' ');
              
              return (
                <td 
                  key={column.id}
                  className={cellClasses}
                  style={{
                    width: column.width,
                    minWidth: column.width,
                    position: column.sticky ? 'sticky' : undefined,
                    left: column.sticky ? 0 : undefined,
                    background: column.sticky ? 'var(--background)' : undefined,
                    ...(striped && rowIndex % 2 !== 0 && column.sticky ? { background: 'var(--table-stripe-bg)' } : {})
                  }}
                >
                  {getCellValue(row, column, rowIndex)}
                </td>
              );
            })}
          </tr>
        ))
      )}
    </tbody>
  );
};

// Pagination component
const TablePagination = ({
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: {
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    if (onPageChange) onPageChange(page);
  };
  
  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    if (onPageSizeChange) onPageSizeChange(newPageSize);
  };
  
  // Render page numbers
  const renderPageNumbers = () => {
    const pages = [];
    const maxDisplayedPages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    const endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
    
    // Adjust startPage if we're near the end
    startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    
    // Always show first page
    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          className="px-3 py-1 rounded hover:bg-[var(--btn-secondary-hover)] focus:outline-none"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      
      // Show ellipsis if needed
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-3 py-1">
            ...
          </span>
        );
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 rounded focus:outline-none ${
            i === currentPage
              ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
              : 'hover:bg-[var(--btn-secondary-hover)]'
          }`}
          onClick={() => handlePageChange(i)}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    
    // Always show last page
    if (endPage < totalPages) {
      // Show ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-3 py-1">
            ...
          </span>
        );
      }
      
      pages.push(
        <button
          key={totalPages}
          className="px-3 py-1 rounded hover:bg-[var(--btn-secondary-hover)] focus:outline-none"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };
  
  const startItem = Math.min(totalItems, (currentPage - 1) * pageSize + 1);
  const endItem = Math.min(totalItems, currentPage * pageSize);
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between py-3 px-4 border-t border-[var(--table-border)]">
      <div className="text-sm text-[var(--foreground)] mb-4 sm:mb-0">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <label htmlFor="page-size" className="mr-2 text-sm text-[var(--foreground)]">
            Show
          </label>
          <select
            id="page-size"
            className="rounded border border-[var(--btn-secondary-border)] bg-[var(--input-background)] p-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--btn-primary-ring)]"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <button
            className="p-1 rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center mx-2">
            {renderPageNumbers()}
          </div>
          
          <button
            className="p-1 rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Table component
export function Table<T extends Record<string, unknown>>(props: TableProps<T>): React.ReactElement {
  const {
    data,
    columns,
    striped = true,
    bordered = false,
    loading = false,
    // We're intentionally not using loadingIndicator here, but keeping it in the props interface for future use
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadingIndicator,
    hover = true,
    responsive = true,
    size = 'md',
    variant = 'default',
    stickyHeader = false,
    maxHeight,
    emptyMessage = 'No data available',
    onRowClick,
    isRowDisabled,
    rowClassName = '',
    sortable = false,
    defaultSortColumn,
    defaultSortDirection = 'asc',
    sortColumn: controlledSortColumn,
    sortDirection: controlledSortDirection,
    onSortChange,
    sortFunction,
    pagination = false,
    currentPage: controlledCurrentPage = 1,
    pageSize: controlledPageSize = 10,
    totalItems: controlledTotalItems,
    onPageChange,
    pageSizeOptions = [10, 25, 50, 100],
    onPageSizeChange,
    className = '',
    headClassName = '',
    bodyClassName = '',
    headerRowClassName = '',
    tableWrapper,
    renderEmpty,
    style,
    ...rest
  } = props;
  
  // Internal state for sorting
  const [internalSortColumn, setInternalSortColumn] = useState<string | undefined>(defaultSortColumn);
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>(defaultSortDirection);
  
  // Internal state for pagination - these are used when component is uncontrolled
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [internalCurrentPage, setInternalCurrentPage] = useState<number>(controlledCurrentPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [internalPageSize, setInternalPageSize] = useState<number>(controlledPageSize);
  
  // Use controlled or internal state
  const sortColumnValue = controlledSortColumn !== undefined ? controlledSortColumn : internalSortColumn;
  const sortDirectionValue = controlledSortDirection !== undefined ? controlledSortDirection : internalSortDirection;
  const currentPageValue = controlledCurrentPage;
  const pageSizeValue = controlledPageSize;
  
  // Update internal state when controlled props change
  useEffect(() => {
    if (controlledSortColumn !== undefined) setInternalSortColumn(controlledSortColumn);
    if (controlledSortDirection !== undefined) setInternalSortDirection(controlledSortDirection);
    setInternalCurrentPage(controlledCurrentPage);
    setInternalPageSize(controlledPageSize);
  }, [controlledSortColumn, controlledSortDirection, controlledCurrentPage, controlledPageSize]);
  
  // Handle sort change
  const handleSortChange = (column: string, direction: SortDirection) => {
    if (onSortChange) {
      onSortChange(column, direction);
    } else {
      setInternalSortColumn(direction === 'none' ? undefined : column);
      setInternalSortDirection(direction);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(pageSize);
    } else {
      setInternalPageSize(pageSize);
      // Reset to first page when changing page size
      if (onPageChange) {
        onPageChange(1);
      } else {
        setInternalCurrentPage(1);
      }
    }
  };
  
  // Sort data if needed
  const sortedData = React.useMemo(() => {
    if (!sortable || !sortColumnValue || sortDirectionValue === 'none') {
      return [...data];
    }
    
    const sorted = [...data].sort((a, b) => {
      if (sortFunction) {
        return sortFunction(a, b, sortColumnValue, sortDirectionValue);
      }
      
      const column = columns.find(col => col.id === sortColumnValue);
      if (!column) return 0;
      
      const aValue = typeof column.accessor === 'function'
        ? column.accessor(a, 0)
        : a[column.accessor];
        
      const bValue = typeof column.accessor === 'function'
        ? column.accessor(b, 0)
        : b[column.accessor];
      
      if (aValue === bValue) return 0;
      
      // Handle different types of values for sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirectionValue === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // For numbers, dates, and other comparable types
      if (aValue === null || aValue === undefined || bValue === null || bValue === undefined) {
        return 0;
      }
      
      return sortDirectionValue === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });
    
    return sorted;
  }, [data, columns, sortable, sortColumnValue, sortDirectionValue, sortFunction]);
  
  // Apply pagination if needed
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const start = (currentPageValue - 1) * pageSizeValue;
    const end = start + pageSizeValue;
    
    return sortedData.slice(start, end);
  }, [sortedData, pagination, currentPageValue, pageSizeValue]);
  
  // Calculate total items for pagination
  const totalItems = controlledTotalItems !== undefined ? controlledTotalItems : data.length;
  
  // Table size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  // Table variant classes
  const variantClasses = {
    default: '',
    primary: 'bg-[var(--input-background)]',
    minimal: 'bg-transparent',
  };
  
  // Main table classes
  const tableClasses = [
    'w-full',
    sizeClasses[size],
    variantClasses[variant],
    bordered ? 'border border-[var(--table-border)]' : '',
    className,
  ].filter(Boolean).join(' ');
  
  // Wrapper classes for responsive behavior
  const wrapperClasses = [
    responsive ? 'overflow-x-auto' : '',
    stickyHeader ? 'overflow-y-auto' : '',
  ].filter(Boolean).join(' ');
  
  // Build table element
  const tableElement = (
    <table className={tableClasses} style={style} {...rest}>
      <TableHead<T>
        columns={columns}
        sortable={sortable}
        sortColumn={sortColumnValue}
        sortDirection={sortDirectionValue}
        onSortChange={handleSortChange}
        stickyHeader={stickyHeader}
        headerRowClassName={headerRowClassName}
        headClassName={headClassName}
      />
      <TableBody<T>
        data={paginatedData}
        columns={columns}
        striped={striped}
        hover={hover}
        onRowClick={onRowClick}
        isRowDisabled={isRowDisabled}
        rowClassName={rowClassName}
        bodyClassName={bodyClassName}
        emptyMessage={emptyMessage}
        renderEmpty={renderEmpty}
        loading={loading}
      />
    </table>
  );
  
  // Final render
  return (
    <div className="flex flex-col">
      {/* Table container */}
      <div 
        className={wrapperClasses}
        style={{ maxHeight: stickyHeader ? maxHeight : undefined }}
      >
        {tableWrapper ? tableWrapper(tableElement) : tableElement}
      </div>
      
      {/* Pagination */}
      {pagination && (
        <TablePagination
          currentPage={currentPageValue}
          pageSize={pageSizeValue}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}

export default Table; 