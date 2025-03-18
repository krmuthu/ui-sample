# Clipper UI - Grid and Table Components

This document provides documentation for the Grid system and Table components in the Clipper UI library.

## Grid System

The Grid system provides a flexible way to create responsive layouts using a 12-column grid based on Flexbox. It includes the following components:

### Container

The Container component is used to center and constrain content within a maximum width.

```jsx
import { Container } from 'clipper-ui';

<Container>
  {/* Your content here */}
</Container>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fluid` | boolean | `false` | When true, the container takes the full width of the viewport |
| `maxWidth` | string | `'1200px'` | Maximum width of the container |
| `padding` | string | `'1rem'` | Padding on the left and right sides |
| `className` | string | `''` | Additional CSS class names |
| `children` | ReactNode | Required | Container content |

### Row

The Row component arranges children in a horizontal layout.

```jsx
import { Row } from 'clipper-ui';

<Row>
  {/* Your columns here */}
</Row>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | number \| string | `0` | Gap between columns |
| `justify` | 'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly' | `'start'` | Horizontal alignment of columns |
| `align` | 'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch' | `'stretch'` | Vertical alignment of columns |
| `wrap` | boolean | `true` | Whether columns should wrap to the next line |
| `reverse` | boolean | `false` | Reverse the order of columns |
| `noGutters` | boolean | `false` | Remove gutters (padding) between columns |
| `className` | string | `''` | Additional CSS class names |
| `children` | ReactNode | Required | Row content (typically columns) |

### Col

The Col component defines a column within a Row.

```jsx
import { Col } from 'clipper-ui';

<Col width={6}>
  {/* Column content */}
</Col>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number | `12` | Number of grid columns to span (1-12) |
| `offset` | number | `0` | Number of grid columns to offset |
| `sm` | number | - | Column width for small screens (≥576px) |
| `md` | number | - | Column width for medium screens (≥768px) |
| `lg` | number | - | Column width for large screens (≥992px) |
| `xl` | number | - | Column width for extra-large screens (≥1200px) |
| `order` | number | - | Order of the column |
| `className` | string | `''` | Additional CSS class names |
| `children` | ReactNode | Required | Column content |

### Grid

The Grid component combines Container, Row, and Col for a complete grid layout.

```jsx
import { Grid } from 'clipper-ui';

<Grid container>
  <Grid item width={6} md={4}>
    {/* Column content */}
  </Grid>
  <Grid item width={6} md={8}>
    {/* Column content */}
  </Grid>
</Grid>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container` | boolean | `false` | Makes the Grid a container (like Container component) |
| `item` | boolean | `false` | Makes the Grid an item (like Col component) |
| All Container props | | | When `container` is true |
| All Row props | | | When `container` is true |
| All Col props | | | When `item` is true |

### Example

```jsx
import { Container, Row, Col } from 'clipper-ui';

function Example() {
  return (
    <Container>
      <Row gap={2}>
        <Col width={12} md={6} lg={4}>
          Column 1
        </Col>
        <Col width={12} md={6} lg={4}>
          Column 2
        </Col>
        <Col width={12} lg={4}>
          Column 3
        </Col>
      </Row>
    </Container>
  );
}
```

## Table Component

The Table component provides a versatile way to display tabular data with features like sorting, pagination, and customization.

```jsx
import { Table } from 'clipper-ui';

const columns = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true
  },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email'
  }
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

<Table
  data={data}
  columns={columns}
  sortable
  pagination
/>
```

### Column Definition

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier for the column |
| `header` | ReactNode | Header text or content |
| `accessor` | string \| function | Field name or function to get cell value |
| `align` | 'left' \| 'center' \| 'right' | Cell alignment (default: 'left') |
| `width` | string \| number | Width of the column |
| `sortable` | boolean | Whether the column is sortable |
| `cell` | function | Custom cell renderer |
| `headerCell` | function | Custom header cell renderer |
| `hidden` | boolean | Whether the column is hidden |
| `sticky` | boolean | Whether the column is sticky |
| `wrap` | boolean | Whether the column should wrap content |
| `headerClassName` | string | Extra class name for the column header |
| `cellClassName` | string | Extra class name for the column cells |

### Table Props

#### Data and Columns

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | array | Required | Data to be displayed in the table |
| `columns` | array | Required | Column definitions |

#### Visual Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `striped` | boolean | `true` | Whether the table should have zebra striping |
| `bordered` | boolean | `false` | Whether the table should have borders |
| `hover` | boolean | `true` | Whether to enable hover effect on rows |
| `responsive` | boolean | `true` | Horizontal scrolling on small screens |
| `size` | 'sm' \| 'md' \| 'lg' | `'md'` | Size of the table |
| `variant` | 'default' \| 'primary' \| 'minimal' | `'default'` | Visual variant of the table |
| `stickyHeader` | boolean | `false` | Whether the table should have a sticky header |
| `maxHeight` | string \| number | - | Height of the table body when using stickyHeader |
| `className` | string | `''` | Additional table class name |
| `headClassName` | string | `''` | Additional table head class name |
| `bodyClassName` | string | `''` | Additional table body class name |
| `headerRowClassName` | string | `''` | Additional header row class name |

#### Loading and Empty States

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | boolean | `false` | Whether the table should be in a loading state |
| `loadingIndicator` | ReactNode | - | Custom loading component |
| `emptyMessage` | ReactNode | `'No data available'` | Message to show when no data is available |
| `renderEmpty` | function | - | Render a custom empty state |

#### Row Interaction

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRowClick` | function | - | Callback for row click |
| `isRowDisabled` | function | - | Function to determine if a row is disabled |
| `rowClassName` | string \| function | `''` | Custom row class name |

#### Sorting

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sortable` | boolean | `false` | Whether to enable sorting |
| `defaultSortColumn` | string | - | Default sort column |
| `defaultSortDirection` | 'asc' \| 'desc' \| 'none' | `'asc'` | Default sort direction |
| `sortColumn` | string | - | Controlled sort column |
| `sortDirection` | 'asc' \| 'desc' \| 'none' | - | Controlled sort direction |
| `onSortChange` | function | - | Callback for sort changes |
| `sortFunction` | function | - | Custom sort function |

#### Pagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pagination` | boolean | `false` | Whether to enable pagination |
| `currentPage` | number | `1` | Current page (1-based) |
| `pageSize` | number | `10` | Number of rows per page |
| `totalItems` | number | - | Total number of items (for server-side pagination) |
| `onPageChange` | function | - | Callback for page change |
| `pageSizeOptions` | number[] | `[10, 25, 50, 100]` | Page size options |
| `onPageSizeChange` | function | - | Callback for page size change |

### Examples

#### Basic Table

```jsx
import { Table } from 'clipper-ui';

const columns = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name'
  },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email'
  }
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

function BasicTable() {
  return (
    <Table
      data={data}
      columns={columns}
    />
  );
}
```

#### Table with Sorting and Pagination

```jsx
import { Table } from 'clipper-ui';

const columns = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true
  },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email',
    sortable: true
  },
  {
    id: 'role',
    header: 'Role',
    accessor: 'role'
  }
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  // ... more data
];

function SortableTable() {
  return (
    <Table
      data={data}
      columns={columns}
      sortable
      defaultSortColumn="name"
      defaultSortDirection="asc"
      pagination
      pageSize={5}
    />
  );
}
```

#### Table with Custom Cell Renderer

```jsx
import { Table } from 'clipper-ui';

const columns = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name'
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    cell: (value, row) => {
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
      };
      
      return (
        <span className={`px-2 py-1 rounded-full ${statusColors[value]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    accessor: () => null,
    cell: (_, row) => (
      <div className="flex gap-2">
        <button 
          className="p-1 text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            alert(`View ${row.name}`);
          }}
        >
          View
        </button>
        <button 
          className="p-1 text-green-600"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Edit ${row.name}`);
          }}
        >
          Edit
        </button>
      </div>
    )
  }
];

const data = [
  { id: 1, name: 'John Doe', status: 'active' },
  { id: 2, name: 'Jane Smith', status: 'pending' },
  { id: 3, name: 'Bob Johnson', status: 'inactive' }
];

function CustomCellTable() {
  return (
    <Table
      data={data}
      columns={columns}
      onRowClick={(row) => alert(`Row clicked: ${row.name}`)}
    />
  );
}
```

## Performance Optimizations

The Clipper UI library now includes several performance optimizations to ensure components render efficiently and minimize bundle size:

### Optimized Bundle Size

1. **Tree Shaking Enhancements**
   - Configured Rollup with advanced tree shaking settings
   - Component-specific imports (`import Button from 'clipper-ui/Button'`)
   - Reduced side effects for better dead code elimination

2. **Component-by-Component Imports**
   - Individual component bundles enable selective importing
   - Smaller bundle sizes when only using specific components

### Rendering Performance

1. **Component Memoization**
   - Critical components use React.memo to prevent unnecessary re-renders
   - Custom memoization for complex components with nested data structures

2. **Event Handling Optimizations**
   - Debouncing for input-heavy components (like searchable Tables)
   - Throttling for scroll events and resize handling

3. **Virtualization for Large Datasets**
   - Table component implements virtual rendering for large datasets
   - Only visible rows are rendered, improving performance dramatically

### Developer Utilities

1. **Performance Monitoring**
   - Built-in performance monitoring tools during development
   - Metrics for render times, component updates, and memory usage

2. **Performance Testing**
   - Automated performance test suite to detect regressions
   - Benchmarking for component rendering and initialization

### Using Performance Features

#### 1. Selective Imports for Smaller Bundles

```jsx
// Instead of importing the entire library:
import { Button, Table, Grid } from 'clipper-ui';

// Import only what you need:
import Button from 'clipper-ui/Button';
import Table from 'clipper-ui/Table';
```

#### 2. Using Performance Monitoring During Development

```jsx
import { PerformanceMonitor } from 'clipper-ui/utils/performance-monitor';

const YourApp = () => (
  <PerformanceMonitor id="TableComponent">
    <Table data={largeDataset} />
  </PerformanceMonitor>
);
```

#### 3. Using Debounce and Throttle

```jsx
import { debounce, throttle } from 'clipper-ui/utils/performance';

// Debouncing an input event
const handleSearch = debounce((searchTerm) => {
  // Perform search operation
  fetchResults(searchTerm);
}, 300);

// Throttling a scroll event
const handleScroll = throttle(() => {
  // Update UI based on scroll position
  updateHeader();
}, 100);
```

#### 4. Performance Testing

```bash
# Run the performance test suite
npm run perf:test
```

These optimizations ensure that Clipper UI components perform efficiently in production applications, even with large datasets and complex UIs.

## Component-Specific Builds

To enable better tree-shaking and selective imports, the Clipper UI library now supports component-by-component builds. This significantly reduces bundle sizes when only specific components are needed.

### Benefits

- **Smaller Bundle Sizes**: Individual component bundles are much smaller than the full library bundle
  - Full library: ~84KB
  - Table component: ~16KB
  - Button component: ~4KB
- **Improved Tree Shaking**: Consumers can import only the components they need
- **Better Performance**: Smaller bundle sizes lead to faster load times

### Usage

Components can be imported directly from their specific paths:

```js
// Import specific components (smaller bundles)
import Button from 'clipper-ui/dist/components/Button';
import Table from 'clipper-ui/dist/components/Table';
import TextField from 'clipper-ui/dist/components/TextField';

// vs importing from the main bundle (larger)
import { Button, Table, TextField } from 'clipper-ui';
```

### Implementation Details

Each component is built using:
- Babel for transpiling TypeScript to JavaScript
- TypeScript compiler for generating type declarations
- ESM and CommonJS output formats
- Named exports for better compatibility

The build process creates the following files for each component:
- `dist/components/[ComponentName]/index.js` (CommonJS)
- `dist/components/[ComponentName]/index.esm.js` (ES Modules)
- `dist/components/[ComponentName]/[ComponentName].d.ts` (Type declarations)
- `dist/components/[ComponentName]/index.d.ts` (Type exports)

### Building Components

To build all components:

```bash
npm run build:components
```

To build the entire library including components:

```bash
npm run build:all
``` 