import React, { Profiler, ProfilerOnRenderCallback } from 'react';

/**
 * Props for the PerformanceMonitor component
 */
export interface PerformanceMonitorProps {
  /**
   * Unique identifier for the profiled component
   */
  id: string;
  
  /**
   * Optional custom render callback function
   */
  onRender?: ProfilerOnRenderCallback;
  
  /**
   * Content to be profiled
   */
  children: React.ReactNode;
}

/**
 * Default render callback that logs performance metrics to the console in development mode
 */
const defaultOnRender: ProfilerOnRenderCallback = (
  id, 
  phase, 
  actualDuration, 
  baseDuration, 
  startTime, 
  commitTime
) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${id} - ${phase}`);
    console.log(`  Actual duration: ${actualDuration.toFixed(2)}ms`);
    console.log(`  Base duration: ${baseDuration.toFixed(2)}ms`);
    console.log(`  Commit time: ${commitTime.toFixed(2)}ms`);
  }
};

/**
 * PerformanceMonitor component
 * Wraps children in a React Profiler to measure rendering performance
 * Only active in development mode or when explicitly enabled
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  id, 
  onRender = defaultOnRender, 
  children 
}) => {
  // Only use the Profiler in development or when explicitly enabled
  if (process.env.NODE_ENV !== 'development' && 
      process.env.ENABLE_PROFILING !== 'true') {
    return <>{children}</>;
  }
  
  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}; 