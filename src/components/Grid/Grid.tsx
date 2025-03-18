import React from 'react';

// Container Component
export interface ContainerProps {
  /**
   * Content to be rendered inside the container
   */
  children: React.ReactNode;
  
  /**
   * Maximum width of the container
   * @default "lg"
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  
  /**
   * Whether to add padding to the container
   * @default true
   */
  padding?: boolean;
  
  /**
   * Whether the container should take up the full width of its parent
   * @default false
   */
  fluid?: boolean;
  
  /**
   * Additional CSS class name for the container
   */
  className?: string;
  
  /**
   * Additional inline styles for the container
   */
  style?: React.CSSProperties;
  
  /**
   * Additional props to be spread to the container element
   */
  [key: string]: unknown;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = true,
  fluid = false,
  className = '',
  style,
  ...rest
}) => {
  // Maximum width values based on common breakpoints
  const maxWidthMap = {
    xs: 'max-w-xs',       // 320px
    sm: 'max-w-sm',       // 384px
    md: 'max-w-md',       // 448px
    lg: 'max-w-lg',       // 512px
    xl: 'max-w-xl',       // 576px
    '2xl': 'max-w-2xl',   // 672px
    full: 'max-w-full',   // 100%
    none: ''              // No max width
  };
  
  const containerClasses = [
    'mx-auto',
    'w-full',
    fluid ? 'max-w-full' : maxWidthMap[maxWidth],
    padding ? 'px-4 sm:px-6 md:px-8' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses} style={style} {...rest}>
      {children}
    </div>
  );
};

// Row Component
export interface RowProps {
  /**
   * Content to be rendered inside the row
   */
  children: React.ReactNode;
  
  /**
   * Horizontal alignment of the row's children
   * @default "start"
   */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  
  /**
   * Vertical alignment of the row's children
   * @default "start"
   */
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  
  /**
   * Gap between row items
   * @default 4
   */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  
  /**
   * Whether to wrap the row's children
   * @default true
   */
  wrap?: boolean;
  
  /**
   * Whether to reverse the order of the row's children
   * @default false
   */
  reverse?: boolean;
  
  /**
   * Additional CSS class name for the row
   */
  className?: string;
  
  /**
   * Additional inline styles for the row
   */
  style?: React.CSSProperties;
  
  /**
   * Additional props to be spread to the row element
   */
  [key: string]: unknown;
}

export const Row: React.FC<RowProps> = ({
  children,
  justify = 'start',
  align = 'start',
  gap = 4,
  wrap = true,
  reverse = false,
  className = '',
  style,
  ...rest
}) => {
  // Mapping prop values to Tailwind classes
  const justifyMap = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };
  
  const alignMap = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };
  
  const gapMap = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12'
  };
  
  const rowClasses = [
    'flex',
    reverse ? 'flex-row-reverse' : 'flex-row',
    wrap ? 'flex-wrap' : 'flex-nowrap',
    justifyMap[justify],
    alignMap[align],
    gapMap[gap],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={rowClasses} style={style} {...rest}>
      {children}
    </div>
  );
};

// Column Component
export interface ColProps {
  /**
   * Content to be rendered inside the column
   */
  children: React.ReactNode;
  
  /**
   * Number of columns to span (out of 12)
   * @default 12
   */
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'content';
  
  /**
   * Number of columns to span on small screens (sm)
   */
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'content';
  
  /**
   * Number of columns to span on medium screens (md)
   */
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'content';
  
  /**
   * Number of columns to span on large screens (lg)
   */
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'content';
  
  /**
   * Number of columns to span on extra large screens (xl)
   */
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'content';
  
  /**
   * Horizontal alignment of the column's content
   */
  justify?: 'start' | 'end' | 'center';
  
  /**
   * Vertical alignment of the column's content
   */
  align?: 'start' | 'end' | 'center' | 'stretch';
  
  /**
   * Order of the column
   */
  order?: 'first' | 'last' | 'none' | number;
  
  /**
   * Number of columns to offset
   */
  offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  
  /**
   * Additional CSS class name for the column
   */
  className?: string;
  
  /**
   * Additional inline styles for the column
   */
  style?: React.CSSProperties;
  
  /**
   * Additional props to be spread to the column element
   */
  [key: string]: unknown;
}

export const Col: React.FC<ColProps> = ({
  children,
  span = 12,
  sm,
  md,
  lg,
  xl,
  justify,
  align,
  order,
  offset = 0,
  className = '',
  style,
  ...rest
}) => {
  // Functions to map values to Tailwind classes
  const getSpanClass = (value: ColProps['span'], breakpoint: string = '') => {
    const prefix = breakpoint ? `${breakpoint}:` : '';
    
    if (value === 'auto') return `${prefix}flex-auto`;
    if (value === 'content') return `${prefix}flex-initial`;
    
    // Calculate percentage width based on 12-column grid
    return value ? `${prefix}w-${value * 100 / 12}%` : '';
  };
  
  const getOffsetClass = (value: number) => {
    return value > 0 ? `ml-${value * 100 / 12}%` : '';
  };
  
  const getOrderClass = (value: ColProps['order']) => {
    if (value === 'first') return 'order-first';
    if (value === 'last') return 'order-last';
    if (value === 'none') return 'order-none';
    if (typeof value === 'number') return `order-${value}`;
    return '';
  };
  
  const getJustifyClass = (value: ColProps['justify']) => {
    if (value === 'start') return 'justify-start';
    if (value === 'end') return 'justify-end';
    if (value === 'center') return 'justify-center';
    return '';
  };
  
  const getAlignClass = (value: ColProps['align']) => {
    if (value === 'start') return 'items-start';
    if (value === 'end') return 'items-end';
    if (value === 'center') return 'items-center';
    if (value === 'stretch') return 'items-stretch';
    return '';
  };
  
  const colClasses = [
    'flex-shrink-0',
    getSpanClass(span),
    sm && getSpanClass(sm, 'sm'),
    md && getSpanClass(md, 'md'),
    lg && getSpanClass(lg, 'lg'),
    xl && getSpanClass(xl, 'xl'),
    offset && getOffsetClass(offset),
    order && getOrderClass(order),
    justify && getJustifyClass(justify),
    align && getAlignClass(align),
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={colClasses} style={style} {...rest}>
      {children}
    </div>
  );
};

// Grid component that combines Container, Row, and Col
export interface GridProps {
  /**
   * Content to be rendered inside the grid
   */
  children: React.ReactNode;
  
  /**
   * Number of columns in the grid
   * @default 12
   */
  columns?: number;
  
  /**
   * Gap between grid items
   * @default 4
   */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  
  /**
   * Auto-layout mode to create responsive grid layouts
   * - "none": Fixed number of columns specified by the columns prop
   * - "auto-fill": Fill the row with as many columns as possible based on minColumnWidth
   * - "auto-fit": Same as auto-fill but expands columns to fill any remaining space
   * @default "none"
   */
  autoLayout?: 'none' | 'auto-fill' | 'auto-fit';
  
  /**
   * Minimum width of each column when using auto-layout
   * @default "250px"
   */
  minColumnWidth?: string;
  
  /**
   * Maximum width of each column when using auto-layout
   * @default "1fr"
   */
  maxColumnWidth?: string;
  
  /**
   * Additional CSS class name for the grid
   */
  className?: string;
  
  /**
   * Additional inline styles for the grid
   */
  style?: React.CSSProperties;
  
  /**
   * Additional props to be spread to the grid element
   */
  [key: string]: unknown;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 12,
  gap = 4,
  autoLayout = 'none',
  minColumnWidth = '250px',
  maxColumnWidth = '1fr',
  className = '',
  style = {},
  ...rest
}) => {
  const gapMap = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12'
  };
  
  // Create appropriate grid template columns based on the autoLayout prop
  let gridTemplateColumns = '';
  if (autoLayout === 'auto-fill') {
    gridTemplateColumns = `repeat(auto-fill, minmax(${minColumnWidth}, ${maxColumnWidth}))`;
  } else if (autoLayout === 'auto-fit') {
    gridTemplateColumns = `repeat(auto-fit, minmax(${minColumnWidth}, ${maxColumnWidth}))`;
  }
  
  // Merge existing style with grid-template-columns when using auto-layout
  const gridStyle = {
    ...style,
    ...(autoLayout !== 'none' ? { gridTemplateColumns } : {})
  };
  
  const gridClasses = [
    'grid',
    // Only use grid-cols-{n} when not using auto-layout
    autoLayout === 'none' ? `grid-cols-${columns}` : '',
    gapMap[gap],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={gridClasses} style={gridStyle} {...rest}>
      {children}
    </div>
  );
};

// Export all grid components
export default {
  Container,
  Row,
  Col,
  Grid
}; 