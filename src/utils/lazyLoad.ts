import React, { Suspense } from 'react';

/**
 * Props interface for lazy loaded components
 */
export interface LazyComponentProps {
  /**
   * Optional custom fallback element to show while loading
   */
  fallback?: React.ReactNode;
}

/**
 * Utility function to lazily load a component
 * This enables code splitting and reduces initial bundle size
 * 
 * @param importFunc - Dynamic import function that returns the component
 * @param fallback - Optional fallback UI to show while loading
 * @returns A new component that lazily loads the target component
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null
): React.FC<React.ComponentProps<T> & LazyComponentProps> {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T> & LazyComponentProps) => (
    <Suspense fallback={props.fallback || fallback}>
      <LazyComponent {...(props as any)} />
    </Suspense>
  );
} 