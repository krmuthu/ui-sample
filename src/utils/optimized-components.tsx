import React, { useMemo, useCallback } from 'react';
import { Table as OriginalTable, TableProps, SortDirection, TableColumn } from '../components/Table/Table';
import { throttle } from './performance';

/**
 * Optimized Table component with memoization and performance enhancements
 */
export const OptimizedTable = React.memo<TableProps<Record<string, unknown>>>((
  { 
    data, 
    columns, 
    sortable, 
    onSortChange,
    onRowClick,
    ...rest 
  }
) => {
  // Memoize data processing if needed
  const processedData = useMemo(() => {
    // Only do expensive data transformations here
    // This is just an example - the actual implementation would depend on your needs
    return data;
  }, [data]);
  
  // Memoize column definitions if needed
  const processedColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      // Any column processing logic here
    }));
  }, [columns]);
  
  // Optimize handlers with useCallback
  const handleSortChange = useCallback((columnId: string, direction: SortDirection) => {
    if (onSortChange) {
      onSortChange(columnId, direction);
    }
  }, [onSortChange]);
  
  // Throttle row click events
  const handleRowClick = useCallback(
    onRowClick ? throttle((row: Record<string, unknown>, index: number) => {
      if (onRowClick) {
        onRowClick(row, index);
      }
    }, 100) : undefined,
    [onRowClick]
  );
  
  return (
    <OriginalTable
      data={processedData}
      columns={processedColumns}
      sortable={sortable}
      onSortChange={handleSortChange}
      onRowClick={handleRowClick}
      {...rest}
    />
  );
});

OptimizedTable.displayName = 'OptimizedTable';

/**
 * Higher-order component that adds memoization to any component
 */
export function withMemoization<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.MemoExoticComponent<React.ComponentType<P>> {
  const MemoizedComponent = React.memo(Component, propsAreEqual);
  MemoizedComponent.displayName = `Memoized${Component.displayName || Component.name || 'Component'}`;
  return MemoizedComponent;
}

/**
 * Custom equality function that performs deep comparison of objects
 * Use this sparingly as it can be expensive for complex objects
 */
export function deepPropsComparison<P extends object>(
  prevProps: Readonly<P>, 
  nextProps: Readonly<P>
): boolean {
  // Get all keys from both objects
  const allKeys = [...new Set([...Object.keys(prevProps), ...Object.keys(nextProps)])];
  
  // Compare each property
  return allKeys.every(key => {
    const prev = prevProps[key as keyof P];
    const next = nextProps[key as keyof P];
    
    // Handle functions - compare by reference
    if (typeof prev === 'function' && typeof next === 'function') {
      return prev === next;
    }
    
    // Handle arrays - simple JSON.stringify comparison
    if (Array.isArray(prev) && Array.isArray(next)) {
      return JSON.stringify(prev) === JSON.stringify(next);
    }
    
    // Handle objects (excluding null)
    if (
      prev !== null && 
      next !== null && 
      typeof prev === 'object' && 
      typeof next === 'object'
    ) {
      return JSON.stringify(prev) === JSON.stringify(next);
    }
    
    // Simple equality for primitive values
    return prev === next;
  });
} 