# Grid System

Clipper UI includes a flexible grid system that helps you create responsive layouts with ease. The grid system is built on CSS Grid and Flexbox, providing modern layout capabilities while maintaining compatibility with older browsers.

## Components

The grid system consists of the following components:

- **Container**: Creates a centered, max-width container for your content
- **Row**: Creates a horizontal row of columns using Flexbox
- **Col**: Creates a column within a row, with configurable width and responsiveness
- **Grid**: Creates a CSS Grid layout with configurable columns and auto-layout options

## Basic Usage

```jsx
import { Container, Row, Col, Grid } from 'clipper-ui';

// Using Container, Row, and Col (Flexbox-based)
function FlexboxLayout() {
  return (
    <Container maxWidth="lg">
      <Row gap={4}>
        <Col span={6} md={4} lg={3}>Column 1</Col>
        <Col span={6} md={4} lg={3}>Column 2</Col>
        <Col span={6} md={4} lg={3}>Column 3</Col>
        <Col span={6} md={4} lg={3}>Column 4</Col>
      </Row>
    </Container>
  );
}

// Using Grid component (CSS Grid-based)
function GridLayout() {
  return (
    <Container maxWidth="lg">
      <Grid columns={4} gap={4}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </Grid>
    </Container>
  );
}

// Using Grid with auto-layout
function AutoLayoutGrid() {
  return (
    <Container maxWidth="lg">
      <Grid 
        autoLayout="auto-fit"
        minColumnWidth="250px"
        gap={4}
      >
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </Grid>
    </Container>
  );
}
```

## Container Component

The Container component creates a centered, max-width container for your content.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full' \| 'none'` | `'lg'` | Maximum width of the container |
| `padding` | `boolean` | `true` | Whether to add padding to the container |
| `fluid` | `boolean` | `false` | Whether the container should take up the full width of its parent |
| `className` | `string` | `''` | Additional CSS class name |
| `style` | `React.CSSProperties` | `{}` | Additional inline styles |

### Container Max Width Values

| Value | Width |
|-------|-------|
| `xs` | 320px |
| `sm` | 384px |
| `md` | 448px |
| `lg` | 512px |
| `xl` | 576px |
| `2xl` | 672px |
| `full` | 100% |
| `none` | No max width |

## Row Component

The Row component creates a horizontal row of columns using Flexbox.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `justify` | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | `'start'` | Horizontal alignment of items |
| `align` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | `'start'` | Vertical alignment of items |
| `gap` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 8 \| 10 \| 12` | `4` | Gap between items |
| `wrap` | `boolean` | `true` | Whether to wrap items to new lines |
| `reverse` | `boolean` | `false` | Whether to reverse the order of items |
| `className` | `string` | `''` | Additional CSS class name |
| `style` | `React.CSSProperties` | `{}` | Additional inline styles |

## Col Component

The Col component creates a column within a Row, with configurable width and responsiveness.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `span` | `1-12 \| 'auto' \| 'content'` | `12` | Number of columns to span (out of 12) |
| `sm` | `1-12 \| 'auto' \| 'content'` | — | Columns to span on small screens |
| `md` | `1-12 \| 'auto' \| 'content'` | — | Columns to span on medium screens |
| `lg` | `1-12 \| 'auto' \| 'content'` | — | Columns to span on large screens |
| `xl` | `1-12 \| 'auto' \| 'content'` | — | Columns to span on extra large screens |
| `justify` | `'start' \| 'end' \| 'center'` | — | Horizontal alignment of content |
| `align` | `'start' \| 'end' \| 'center' \| 'stretch'` | — | Vertical alignment of content |
| `order` | `'first' \| 'last' \| 'none' \| number` | — | Order of the column |
| `offset` | `0-11` | `0` | Number of columns to offset |
| `className` | `string` | `''` | Additional CSS class name |
| `style` | `React.CSSProperties` | `{}` | Additional inline styles |

## Grid Component

The Grid component creates a CSS Grid layout with configurable columns and gaps.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number` | `12` | Number of columns in the grid |
| `gap` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 8 \| 10 \| 12` | `4` | Gap between grid items |
| `autoLayout` | `'none' \| 'auto-fill' \| 'auto-fit'` | `'none'` | Auto-layout mode |
| `minColumnWidth` | `string` | `'250px'` | Minimum width of each column when using auto-layout |
| `maxColumnWidth` | `string` | `'1fr'` | Maximum width of each column when using auto-layout |
| `className` | `string` | `''` | Additional CSS class name |
| `style` | `React.CSSProperties` | `{}` | Additional inline styles |

## Responsive Design

The Col component supports responsive design through breakpoint-specific props:

```jsx
<Row>
  {/* 
    - 12 columns (full width) on extra small screens (default)
    - 6 columns (half width) on small screens and up
    - 4 columns (one-third width) on medium screens and up
    - 3 columns (one-quarter width) on large screens and up
  */}
  <Col span={12} sm={6} md={4} lg={3}>
    Responsive Column
  </Col>
</Row>
```

## Auto-Layout Grid

The Grid component now supports auto-layout functionality, which automatically adjusts the number of columns based on available space and specified minimum column width.

```jsx
// Basic auto-fit grid
<Grid 
  autoLayout="auto-fit"
  minColumnWidth="250px"
  gap={4}
>
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</Grid>

// Auto-fill grid (maintains empty space)
<Grid 
  autoLayout="auto-fill"
  minColumnWidth="250px"
  gap={4}
>
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</Grid>
```

For more detailed information on auto-layout, see [Grid Auto-Layout Documentation](grid-auto-layout.md).

## Complex Layout Example

```jsx
<Container maxWidth="xl">
  <Row gap={6}>
    {/* Sidebar takes 3/12 on large screens, 4/12 on medium, and full width on small */}
    <Col span={12} md={4} lg={3}>
      <div className="p-4 bg-gray-100 rounded">Sidebar</div>
    </Col>
    
    {/* Main content area */}
    <Col span={12} md={8} lg={9}>
      <Row gap={4}>
        {/* Auto-layout grid in the main content area */}
        <Grid 
          autoLayout="auto-fit"
          minColumnWidth="250px"
          gap={4}
        >
          <div className="p-4 bg-blue-100 rounded">Card 1</div>
          <div className="p-4 bg-blue-100 rounded">Card 2</div>
          <div className="p-4 bg-blue-100 rounded">Card 3</div>
          <div className="p-4 bg-blue-100 rounded">Card 4</div>
        </Grid>
      </Row>
    </Col>
  </Row>
</Container>
```

## Nesting

Both the Row/Col system and the Grid component support nesting:

```jsx
<Row>
  <Col span={6}>
    <Row>
      <Col span={6}>Nested Column 1</Col>
      <Col span={6}>Nested Column 2</Col>
    </Row>
  </Col>
  <Col span={6}>
    <Grid columns={2} gap={2}>
      <div>Nested Grid Item 1</div>
      <div>Nested Grid Item 2</div>
    </Grid>
  </Col>
</Row>
```

## Gap Values

The gap prop accepts the following values, which map to the following CSS values:

| Gap Value | CSS Equivalent |
|-----------|---------------|
| 0 | 0px |
| 1 | 0.25rem (4px) |
| 2 | 0.5rem (8px) |
| 3 | 0.75rem (12px) |
| 4 | 1rem (16px) |
| 5 | 1.25rem (20px) |
| 6 | 1.5rem (24px) |
| 8 | 2rem (32px) |
| 10 | 2.5rem (40px) |
| 12 | 3rem (48px) | 