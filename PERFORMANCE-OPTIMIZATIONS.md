# Clipper UI Performance Optimizations

This document outlines performance optimization strategies for the Clipper UI component library to ensure smooth rendering, fast loading times, and overall optimal user experience.

## Table of Contents

1. [Component Memoization](#component-memoization)
2. [Code Splitting and Lazy Loading](#code-splitting-and-lazy-loading)
3. [Bundle Size Optimization](#bundle-size-optimization)
4. [CSS Performance Optimizations](#css-performance-optimizations)
5. [Rendering Optimizations](#rendering-optimizations)
6. [Performance Monitoring](#performance-monitoring)
7. [Measuring and Benchmarking](#measuring-and-benchmarking)

## Component Memoization

Memoizing components can prevent unnecessary re-renders when props haven't changed.

### Implementation Examples

#### 1. Memoizing Functional Components

```tsx
// Before
export const MyComponent: React.FC<Props> = (props) => {
  // Component logic
  return <div>...</div>;
};

// After
import React from 'react';

export const MyComponent: React.FC<Props> = React.memo((props) => {
  // Component logic
  return <div>...</div>;
});
```

#### 2. Custom Comparison Function

For components with complex props, provide a custom comparison function:

```tsx
import React from 'react';

export const ComplexComponent: React.FC<ComplexProps> = React.memo(
  (props) => {
    // Component logic
    return <div>...</div>;
  },
  (prevProps, nextProps) => {
    // Return true if rendering should be skipped (props are equal)
    return prevProps.simpleValue === nextProps.simpleValue &&
           JSON.stringify(prevProps.complexValue) === JSON.stringify(nextProps.complexValue);
  }
);
```

#### 3. Using `useMemo` for Expensive Calculations

```tsx
import React, { useMemo } from 'react';

export const DataComponent: React.FC<DataProps> = (props) => {
  const processedData = useMemo(() => {
    // Expensive calculation here
    return props.data.map(item => complexTransformation(item));
  }, [props.data]); // Only recalculate when data changes
  
  return <div>{processedData.map(renderItem)}</div>;
};
```

#### 4. Using `useCallback` for Event Handlers

```tsx
import React, { useCallback } from 'react';

export const InteractiveComponent: React.FC<Props> = (props) => {
  const handleClick = useCallback(() => {
    // Event handling logic
    props.onAction(props.id);
  }, [props.onAction, props.id]); // Only recreate when dependencies change
  
  return <button onClick={handleClick}>Click me</button>;
};
```

## Code Splitting and Lazy Loading

### Implementation Examples

#### 1. Lazy Component Loading

Create a new file in `src/utils/lazyLoad.ts`:

```tsx
import React, { Suspense } from 'react';

interface LazyComponentProps {
  fallback?: React.ReactNode;
}

export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null
): React.FC<React.ComponentProps<T> & LazyComponentProps> {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T> & LazyComponentProps) => (
    <Suspense fallback={props.fallback || fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
```

Usage:

```tsx
// In your library index file, modify exports for components that benefit from lazy loading

// Instead of this:
export { default as ComplexDataGrid } from './components/ComplexDataGrid/ComplexDataGrid';

// Do this:
import { lazyLoad } from './utils/lazyLoad';
export const ComplexDataGrid = lazyLoad(() => import('./components/ComplexDataGrid/ComplexDataGrid'));
```

#### 2. Conditional Imports

For large components only used in specific scenarios:

```tsx
// Before
import { HeavyComponent } from 'clipper-ui';

// After
import { useEffect, useState } from 'react';

const MyComponent = () => {
  const [HeavyComponent, setHeavyComponent] = useState<any>(null);
  
  useEffect(() => {
    if (someCondition) {
      import('clipper-ui/dist/components/HeavyComponent').then(module => {
        setHeavyComponent(() => module.HeavyComponent);
      });
    }
  }, [someCondition]);
  
  return (
    <div>
      {HeavyComponent && <HeavyComponent {...props} />}
    </div>
  );
};
```

## Bundle Size Optimization

### Implementation

#### 1. Modifying Rollup Config for Tree Shaking

Update your `rollup.config.mjs` to enable better tree shaking:

```js
// In rollup.config.mjs
export default {
  // ...existing config
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  },
  // ...
};
```

#### 2. Component Subpaths Export

In your `package.json`, add subpath exports:

```json
{
  "name": "clipper-ui",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js"
    },
    "./Button": {
      "import": "./dist/components/Button/index.esm.js",
      "require": "./dist/components/Button/index.js"
    },
    "./Table": {
      "import": "./dist/components/Table/index.esm.js",
      "require": "./dist/components/Table/index.js"
    },
    "./Grid": {
      "import": "./dist/components/Grid/index.esm.js",
      "require": "./dist/components/Grid/index.js"
    }
    // Add more component subpaths
  }
}
```

This allows consumers to import only what they need:

```js
// Instead of this (which might import everything)
import { Button } from 'clipper-ui';

// Users can do this (which only imports Button)
import Button from 'clipper-ui/Button';
```

#### 3. Component by Component Build

Create a script to build individual component bundles:

```js
// scripts/build-components.js
import { rollup } from 'rollup';
import { promises as fs } from 'fs';
import path from 'path';
import baseConfig from '../rollup.config.mjs';

async function buildComponents() {
  // Get all component directories
  const componentDirs = await fs.readdir(path.join(process.cwd(), 'src/components'));
  
  for (const dir of componentDirs) {
    console.log(`Building component: ${dir}`);
    
    // Create component-specific config
    const config = {
      ...baseConfig,
      input: `src/components/${dir}/index.ts`,
      output: [
        {
          file: `dist/components/${dir}/index.js`,
          format: 'cjs',
          sourcemap: true
        },
        {
          file: `dist/components/${dir}/index.esm.js`,
          format: 'esm',
          sourcemap: true
        }
      ]
    };
    
    // Build
    const bundle = await rollup(config);
    await Promise.all(config.output.map(output => bundle.write(output)));
    await bundle.close();
  }
}

buildComponents().catch(console.error);
```

## CSS Performance Optimizations

### Implementation

#### 1. CSS-in-JS Optimizations

If you use a CSS-in-JS solution, ensure it's optimized:

```tsx
// Before
const buttonStyle = `
  padding: ${props.size === 'small' ? '4px 8px' : '8px 16px'};
  background-color: ${props.primary ? 'blue' : 'gray'};
  // more styles...
`;

// After - memoize styles
const useButtonStyles = (size, primary) => useMemo(() => ({
  padding: size === 'small' ? '4px 8px' : '8px 16px',
  backgroundColor: primary ? 'blue' : 'gray',
  // more styles...
}), [size, primary]);

const Button = (props) => {
  const styles = useButtonStyles(props.size, props.primary);
  return <button style={styles}>{props.children}</button>;
};
```

#### 2. CSS Modules with Purging

Configure PostCSS to purge unused CSS:

```js
// postcss.config.mjs
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    autoprefixer(),
    purgecss({
      content: ['./src/**/*.{js,jsx,ts,tsx}'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    }),
    cssnano({ preset: 'default' })
  ]
};
```

## Rendering Optimizations

### Implementation Examples

#### 1. Virtualized Lists for Large Data

For the Table component, implement virtualization:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedTable = ({ data, rowHeight = 40, columns, ...props }) => {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
  });
  
  return (
    <div 
      ref={parentRef}
      style={{ height: '500px', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${rowHeight}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {/* Render table row */}
            <div className="tr">
              {columns.map(column => (
                <div key={column.id} className="td">
                  {column.cell 
                    ? column.cell(data[virtualRow.index][column.accessor], data[virtualRow.index])
                    : data[virtualRow.index][column.accessor]
                  }
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### 2. Debouncing and Throttling

Add utility functions in `src/utils/performance.ts`:

```typescript
// Debounce function for events that shouldn't fire more than once in a given time
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for events that shouldn't fire more than once per specified interval
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
```

Usage example in components with heavy event processing:

```tsx
import { throttle } from '../../utils/performance';

export const ResizableGrid = (props) => {
  // Instead of directly handling resize, throttle it
  const handleResize = useCallback(
    throttle(() => {
      // Expensive calculation or state update
      recalculateGridLayout();
    }, 100),
    [recalculateGridLayout] // Dependencies
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Component implementation
};
```

## Performance Monitoring

### Implementation

#### 1. Component Performance Wrapper

Create a utility for measuring component performance:

```tsx
// src/utils/performance-monitor.tsx
import React, { Profiler, ProfilerOnRenderCallback } from 'react';

interface PerformanceMonitorProps {
  id: string;
  onRender?: ProfilerOnRenderCallback;
  children: React.ReactNode;
}

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
    console.log(`Actual duration: ${actualDuration.toFixed(2)}ms`);
    console.log(`Base duration: ${baseDuration.toFixed(2)}ms`);
  }
};

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  id, 
  onRender = defaultOnRender, 
  children 
}) => {
  // Only use the Profiler in development or when explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !process.env.ENABLE_PROFILING) {
    return <>{children}</>;
  }
  
  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
};
```

Usage:

```tsx
import { PerformanceMonitor } from '../../utils/performance-monitor';

const App = () => {
  return (
    <div>
      <PerformanceMonitor id="DataGrid">
        <DataGrid data={largeDataSet} />
      </PerformanceMonitor>
    </div>
  );
};
```

#### 2. Add a Performance Testing Script

Create a performance test script:

```js
// scripts/perf-test.js
import puppeteer from 'puppeteer';
import fs from 'fs';

async function runPerformanceTests() {
  console.log('Starting performance tests...');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Enable performance metrics
  await page.evaluateOnNewDocument(() => {
    window.performance.mark('start');
  });
  
  // Navigate to Storybook
  await page.goto('http://localhost:6006/?path=/story/components-table--with-pagination');
  
  // Wait for component to be fully loaded
  await page.waitForSelector('.table-component', { visible: true });
  
  // Measure performance metrics
  const metrics = await page.evaluate(() => {
    window.performance.mark('end');
    window.performance.measure('total', 'start', 'end');
    
    const entries = window.performance.getEntriesByType('measure');
    const fpEntry = window.performance.getEntriesByName('first-paint');
    const fcpEntry = window.performance.getEntriesByName('first-contentful-paint');
    
    return {
      total: entries[0].duration,
      firstPaint: fpEntry.length > 0 ? fpEntry[0].startTime : null,
      firstContentfulPaint: fcpEntry.length > 0 ? fcpEntry[0].startTime : null,
      memory: window.performance.memory ? window.performance.memory.usedJSHeapSize : null
    };
  });
  
  console.log('Performance metrics:', metrics);
  
  // Save results
  fs.writeFileSync('perf-results.json', JSON.stringify(metrics, null, 2));
  
  await browser.close();
  console.log('Performance tests completed!');
}

runPerformanceTests().catch(console.error);
```

## Implementing These Optimizations

To implement these optimizations in your Clipper UI library:

1. Start with memoizing your most complex components (Table, Grid, DatePicker)
2. Add the lazy loading utility for heavy components
3. Update your build configuration for better tree shaking
4. Implement the performance monitoring wrapper for development
5. Apply debouncing and throttling to event-heavy components
6. Consider adding virtualization for the Table component

These optimizations should significantly improve the performance of your component library, making it more efficient for consumers and providing a better end-user experience.

## Measuring and Benchmarking

To get the most out of these performance optimizations, it's important to measure and benchmark your application with the Clipper UI components.

### Bundle Size Analysis

1. **Analyze your bundle size**:

```bash
# Install webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to your webpack config
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

2. **Check component imports**:

Make sure you're using the optimized imports:

```jsx
// Recommended (smaller bundles)
import Button from 'clipper-ui/Button';

// Not recommended (imports everything)
import { Button } from 'clipper-ui';
```

### Runtime Performance Metrics

1. **Use the Performance Monitor in Development**:

The PerformanceMonitor component helps you track component rendering performance:

```jsx
import { PerformanceMonitor } from 'clipper-ui/utils/performance-monitor';

<PerformanceMonitor id="TableComponent">
  <Table data={largeDataset} />
</PerformanceMonitor>
```

2. **Run the built-in performance tests**:

```bash
npm run perf:test
```

This will generate a report in the `perf-results` directory with metrics on component rendering performance.

3. **Use React DevTools Profiler**:

React DevTools includes a Profiler for measuring rendering performance. Use it to identify bottlenecks in your application.

### Performance Optimization Checklist

- [ ] Implement memoization for components with expensive rendering
- [ ] Use debounce/throttle for high-frequency events
- [ ] Switch to component-by-component imports
- [ ] Run a bundle analysis to identify large dependencies
- [ ] Use virtualization for lists/tables with many rows
- [ ] Enable code splitting with lazy loading
- [ ] Monitor render performance in development

By following these guidelines and using the built-in performance utilities, you can ensure that your application performs optimally even as it scales with more data and components. 