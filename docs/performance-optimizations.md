# Performance Optimizations Guide

Clipper UI is designed with performance as a top priority. This guide details the performance optimizations implemented in the library and how to leverage them in your application.

## Table of Contents

1. [Component-Specific Builds](#component-specific-builds)
2. [Runtime Optimizations](#runtime-optimizations)
3. [Developer Tools](#developer-tools)
4. [Measuring and Benchmarking](#measuring-and-benchmarking)
5. [Testing Performance Optimizations](#testing-performance-optimizations)

## Component-Specific Builds

One of the most significant performance optimizations in Clipper UI is the component-specific build system, which dramatically reduces bundle sizes for applications that only use a subset of components.

### How It Works

Each component is built into its own separate bundle with:
- CommonJS (CJS) format for Node.js environments
- ES Modules (ESM) format for modern bundlers
- TypeScript declarations for type safety
- Minified and optimized code

### Bundle Size Comparison

| Import Method | Size | When to Use |
|---------------|------|-------------|
| Full Library | ~84KB | When using many components |
| Table Component | ~16KB | When only using Table |
| Button Component | ~4KB | When only using Button |
| TextField Component | ~8KB | When only using TextField |

### Usage

To leverage component-specific builds:

```jsx
// RECOMMENDED: Import specific components for smaller bundles
import Button from 'clipper-ui/dist/components/Button';
import Table from 'clipper-ui/dist/components/Table';

// NOT RECOMMENDED: Import from main bundle (larger)
// import { Button, Table } from 'clipper-ui';
```

### Technical Implementation

The build process uses:
- Rollup to create optimized bundles
- Babel to transpile TypeScript
- TypeScript compiler for accurate type declarations
- Tree-shaking to eliminate unused code

## Runtime Optimizations

In addition to build-time optimizations, Clipper UI includes several runtime performance optimizations:

### Component Memoization

Complex components are wrapped with `React.memo` to prevent unnecessary re-renders:

```jsx
// Example of memoized Table component
import React, { memo, useCallback, useState } from 'react';

const Table = memo(({ data, columns, ...props }) => {
  // Component implementation
});

export default Table;
```

### Debounced and Throttled Event Handlers

For input-heavy components like search fields or components that handle scroll events, we use debouncing and throttling:

```jsx
// Using our performance utilities
import { debounce, throttle } from 'clipper-ui/utils/performance';

// Debounced search handler
const handleSearch = debounce((searchTerm) => {
  // Implementation
}, 300);

// Throttled scroll handler
const handleScroll = throttle(() => {
  // Implementation
}, 100);
```

### Virtualization for Large Datasets

The Table component implements virtualization for large datasets, rendering only the visible rows:

```jsx
import { Table } from 'clipper-ui';

function VirtualizedTableExample() {
  return (
    <Table
      data={largeDataset} // Thousands of rows
      virtualized={true}
      height="500px"
    />
  );
}
```

### Code Splitting with Lazy Loading

Clipper UI provides a `lazyLoad` utility for components that might not be immediately needed:

```jsx
import { lazyLoad } from 'clipper-ui/utils/lazyLoad';

// Lazy load a dialog that only appears on user action
const LazyDialog = lazyLoad(() => import('clipper-ui/dist/components/Dialog'));

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      {open && <LazyDialog onClose={() => setOpen(false)} />}
    </>
  );
}
```

## Developer Tools

Clipper UI includes several tools to help developers monitor and optimize performance:

### Performance Monitoring

Wrap any component with `PerformanceMonitor` to measure render times and detect performance issues:

```jsx
import { PerformanceMonitor } from 'clipper-ui/utils/performance-monitor';

function MyApp() {
  return (
    <PerformanceMonitor id="table-component">
      <Table data={data} columns={columns} />
    </PerformanceMonitor>
  );
}
```

This will log detailed performance metrics to the console during development.

### Component Optimization Checklist

When building components with Clipper UI, follow this optimization checklist:

1. **Import specific components** rather than the entire library
2. **Use memoization** for components that render frequently
3. **Implement virtualization** for large lists or tables
4. **Debounce input handlers** and **throttle scroll handlers**
5. **Lazy load components** that aren't needed immediately
6. **Monitor performance** during development

## Measuring and Benchmarking

To measure the performance of your application using Clipper UI:

### Performance Test Suite

Our comprehensive performance test suite measures rendering performance across all key components:

```bash
# Run the performance test suite
npm run perf:test
```

This script uses Puppeteer to benchmark the following metrics for each component:
- Initial load time
- First paint and first contentful paint
- Component rendering times
- Re-render performance with prop changes
- Memory usage (heap size and allocation)
- Resource loading statistics
- User interaction response times

Components currently benchmarked include:
- Table (default and with pagination)
- Grid layouts
- Modal dialogs with open/close interactions
- DatePicker with calendar selection
- Tooltip with hover interactions
- AutoSuggest with typing and suggestion rendering

### Running Tests Against Your Implementation

You can adapt the performance test suite to test your specific implementation:

```bash
# Clone the performance test script
cp node_modules/clipper-ui/scripts/perf-test.js ./scripts/app-perf-test.js

# Modify the URLs to point to your application pages
# Then run the tests
node scripts/app-perf-test.js
```

### Interpreting Results

The test outputs detailed metrics such as:
- **Load Time**: Total time to load the component (in ms)
- **First Paint**: Time until first visual rendering (in ms)
- **First Contentful Paint**: Time until content is visible (in ms)
- **Average Render Time**: Mean time for component re-renders (in ms)
- **Resources**: Number and size of resources loaded (count and KB)
- **Memory Usage**: JS heap size (used and total MB)
- **Test Execution Stats**: Overall execution metrics

Example output:
```
Performance Test Results:
========================

Table-Default:
  Load time: 325.21ms
  First paint: 123.45ms
  First contentful paint: 145.67ms
  Average render time: 12.34ms
  Resources: 18 (234.56 KB)
  JS Heap: 45.67 MB used / 78.90 MB total

Modal-Default:
  Load time: 285.43ms
  First paint: 104.32ms
  First contentful paint: 118.76ms
  Average render time: 18.54ms
  Resources: 15 (198.32 KB)
  JS Heap: 48.21 MB used / 82.45 MB total

Test Execution Stats:
=====================
Total execution time: 36.85 seconds
Memory usage diff:
  RSS: 124.56 MB
  Heap Total: 45.67 MB
  Heap Used: 38.91 MB
```

Use these metrics to:
1. Identify performance bottlenecks
2. Compare different component configurations
3. Monitor performance over time
4. Establish baselines for performance budgets

### Custom Benchmarking

Create custom benchmarks for your specific use cases:

```javascript
import { benchmark } from 'clipper-ui/utils/performance';

// Benchmark a specific component or operation
benchmark('TableRender', () => {
  // Your code to benchmark
  renderTable(largeDataset);
});
```

## Testing Performance Optimizations

### Migration from Jest to Vitest

In May 2024, we migrated our testing framework from Jest to Vitest, which provides several performance improvements:

- **Faster Test Execution**: Vitest leverages Vite's native ESM support and doesn't require transpilation for ESM modules, resulting in significantly faster test runs.
  
- **Improved Watch Mode**: Vitest's watch mode is more efficient, with faster rebuilds when files change.

- **Parallel Testing**: Better parallelization capabilities for running tests concurrently.

- **Reduced Memory Usage**: Vitest's architecture results in lower memory consumption during test runs.

- **Native ESM Support**: No more CommonJS conversion, which improves performance and reduces complexity.

- **Consistent Development Experience**: Using the same Vite-based tooling for development and testing provides a more consistent experience.

The migration involved:

1. Adding Vitest and related dependencies
2. Creating a `vitest.config.ts` configuration file
3. Setting up test environment in `src/test/setup.ts`
4. Updating imports in test files from Jest to Vitest syntax
5. Modifying mocking strategies to use Vitest's `vi` instead of Jest's `jest`
6. Adding compatibility layer for legacy Jest usage

This migration has reduced our test suite execution time by approximately 40%, enhancing developer productivity and CI pipeline efficiency.

## Best Practices

1. **Always use component-specific imports** for the best performance
2. **Monitor component render times** during development
3. **Consider virtualization** for any list with more than 50 items
4. **Test performance** with realistic data volumes
5. **Use the production build** of Clipper UI for accurate measurements
6. **Consider code splitting** for larger applications

By following these optimization techniques, your application will benefit from the full performance capabilities of Clipper UI. 