# Grid Auto-Layout

The Grid component in Clipper UI now supports auto-layout functionality through CSS Grid's `auto-fill` and `auto-fit` features. This allows you to create responsive grid layouts where:

1. The number of columns adjusts automatically based on the available space
2. You can set minimum and maximum column widths
3. Items can expand to fill available space or maintain consistent sizing

## Basic Usage

To use the auto-layout feature, set the `autoLayout` prop to either `"auto-fill"` or `"auto-fit"`:

```jsx
// Auto-fit example (columns expand to fill space)
<Grid 
  autoLayout="auto-fit"
  minColumnWidth="200px"
  maxColumnWidth="1fr"
  gap={4}
>
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</Grid>
```

## Auto-Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoLayout` | `'none' \| 'auto-fill' \| 'auto-fit'` | `'none'` | The auto-layout mode to use |
| `minColumnWidth` | `string` | `'250px'` | Minimum width of each column (CSS value) |
| `maxColumnWidth` | `string` | `'1fr'` | Maximum width of each column (CSS value) |

## Auto-Fill vs Auto-Fit

### Auto-Fill

Auto-fill creates as many columns as can fit based on the `minColumnWidth` value, maintaining those empty tracks even when there aren't enough items to fill them.

```jsx
<Grid 
  autoLayout="auto-fill"
  minColumnWidth="200px"
  gap={4}
>
  {/* Content */}
</Grid>
```

**Use auto-fill when:**
- You want a consistent column width regardless of the number of items
- You prefer empty spaces at the end rather than columns stretching
- You're building a grid that's expected to have a consistent density

### Auto-Fit

Auto-fit works similarly to auto-fill but collapses empty tracks and stretches items to fill the available space.

```jsx
<Grid 
  autoLayout="auto-fit"
  minColumnWidth="200px"
  gap={4}
>
  {/* Content */}
</Grid>
```

**Use auto-fit when:**
- You want items to expand and fill the available space
- You prefer a grid without empty spaces
- You're building a gallery or card layout where items should use all available width

## Responsive Layouts

The auto-layout feature makes it easy to create responsive layouts without media queries. By setting an appropriate `minColumnWidth`, your grid will automatically adjust the number of columns based on the screen size.

```jsx
// Responsive card grid with cards that are never smaller than 250px
<Grid 
  autoLayout="auto-fit"
  minColumnWidth="250px"
  gap={4}
>
  {cards.map(card => (
    <Card key={card.id} {...card} />
  ))}
</Grid>
```

## Using With maxColumnWidth

The `maxColumnWidth` prop limits how wide each column can grow:

```jsx
// Columns will be at least 200px and at most 300px
<Grid 
  autoLayout="auto-fit"
  minColumnWidth="200px"
  maxColumnWidth="300px"
  gap={4}
>
  {/* Content */}
</Grid>

// Columns will be at least 200px and will share available space equally
<Grid 
  autoLayout="auto-fit"
  minColumnWidth="200px"
  maxColumnWidth="1fr"
  gap={4}
>
  {/* Content */}
</Grid>
```

## Examples

### Photo Gallery

```jsx
<Grid 
  autoLayout="auto-fit"
  minColumnWidth="180px"
  maxColumnWidth="1fr"
  gap={2}
>
  {photos.map(photo => (
    <img 
      key={photo.id} 
      src={photo.url} 
      alt={photo.description}
      className="w-full h-auto"
    />
  ))}
</Grid>
```

### Product Grid

```jsx
<Grid 
  autoLayout="auto-fill"
  minColumnWidth="240px"
  maxColumnWidth="1fr"
  gap={6}
>
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</Grid>
```

### Dashboard Widgets

```jsx
<Grid 
  autoLayout="auto-fit"
  minColumnWidth="300px"
  maxColumnWidth="1fr"
  gap={4}
>
  <DashboardWidget title="Sales" data={salesData} />
  <DashboardWidget title="Traffic" data={trafficData} />
  <DashboardWidget title="Conversion" data={conversionData} />
  <DashboardWidget title="Revenue" data={revenueData} />
</Grid>
```

## Best Practices

1. **Choose the right mode**:
   - Use `auto-fill` when you want a consistent look with potentially empty spaces
   - Use `auto-fit` when you want items to expand and fill all available space

2. **Set appropriate minimum widths**:
   - For text-heavy content: at least 200-250px for readability
   - For images/cards: depends on the minimum size needed to display content properly
   - For dashboard widgets: typically 300px or more

3. **Use with Container**:
   - Combine with the `Container` component to control the overall maximum width
   
   ```jsx
   <Container maxWidth="xl">
     <Grid autoLayout="auto-fit" minColumnWidth="200px" gap={4}>
       {/* Content */}
     </Grid>
   </Container>
   ```

4. **Flexibly sized items**:
   - For items that need specific column spans, you may need to use the traditional `columns` prop instead

5. **Consistent aspect ratios**:
   - For image grids, consider applying a consistent aspect ratio to each grid item

   ```jsx
   <Grid autoLayout="auto-fit" minColumnWidth="200px">
     {images.map(image => (
       <div key={image.id} className="aspect-square">
         <img src={image.url} className="w-full h-full object-cover" />
       </div>
     ))}
   </Grid>
   ```

## Fallback for Older Browsers

If you need to support browsers that don't fully support CSS Grid's auto features, consider providing a fallback:

```jsx
<Grid 
  columns={4} // Fallback for browsers without auto-layout support
  autoLayout="auto-fit"
  minColumnWidth="200px"
  gap={4}
>
  {/* Content */}
</Grid>
```

Modern browsers will use the auto-layout, while older browsers will fall back to the standard 4-column grid. 