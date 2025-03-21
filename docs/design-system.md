# Clipper UI Design System

This document outlines the design principles, tokens, and component guidelines for the Clipper UI library.

## Design Principles

1. **Consistency**: Components should share common patterns, interactions, and visual styles.
2. **Accessibility**: All components must be accessible to all users.
3. **Flexibility**: Components should be easily customizable while maintaining consistency.
4. **Performance**: Components should be lightweight and optimized for performance.
5. **Clarity**: Visual design should prioritize clarity and usability.

## Design Tokens

### Colors

#### Primary Colors

| Token | Value | Description |
|-------|-------|-------------|
| `--primary-50` | `#F0F9FF` | Lightest primary shade |
| `--primary-100` | `#E0F2FE` | Very light primary |
| `--primary-500` | `#0EA5E9` | Main primary color |
| `--primary-600` | `#0284C7` | Darker primary for hover states |
| `--primary-700` | `#0369A1` | Dark primary for active states |

#### Neutrals

| Token | Value | Description |
|-------|-------|-------------|
| `--gray-50` | `#F9FAFB` | Background, lightest |
| `--gray-100` | `#F3F4F6` | Subtle backgrounds |
| `--gray-200` | `#E5E7EB` | Subtle borders |
| `--gray-500` | `#6B7280` | Muted text |
| `--gray-900` | `#111827` | Primary text |

#### Semantic Colors

| Token | Value | Description |
|-------|-------|-------------|
| `--success-500` | `#10B981` | Success/positive actions |
| `--warning-500` | `#F59E0B` | Warning states |
| `--error-500` | `#EF4444` | Error states |
| `--info-500` | `#3B82F6` | Informational elements |

### Typography

#### Font Family

```css
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
```

#### Font Sizes

| Token | Value | Description |
|-------|-------|-------------|
| `--text-xs` | `0.75rem` | Extra small text |
| `--text-sm` | `0.875rem` | Small text |
| `--text-md` | `1rem` | Base text size |
| `--text-lg` | `1.125rem` | Large text |
| `--text-xl` | `1.25rem` | Extra large text |
| `--text-2xl` | `1.5rem` | 2X large text |
| `--text-3xl` | `1.875rem` | 3X large text |

#### Font Weights

| Token | Value | Description |
|-------|-------|-------------|
| `--font-normal` | `400` | Normal text |
| `--font-medium` | `500` | Medium emphasis |
| `--font-semibold` | `600` | Semi-bold emphasis |
| `--font-bold` | `700` | Bold text |

### Spacing

| Token | Value | Description |
|-------|-------|-------------|
| `--spacing-xs` | `0.25rem` | Extra small spacing (4px) |
| `--spacing-sm` | `0.5rem` | Small spacing (8px) |
| `--spacing-md` | `1rem` | Medium spacing (16px) |
| `--spacing-lg` | `1.5rem` | Large spacing (24px) |
| `--spacing-xl` | `2rem` | Extra large spacing (32px) |

### Borders

| Token | Value | Description |
|-------|-------|-------------|
| `--radius-sm` | `0.125rem` | Small border radius (2px) |
| `--radius-md` | `0.25rem` | Medium border radius (4px) |
| `--radius-lg` | `0.5rem` | Large border radius (8px) |
| `--radius-full` | `9999px` | Full/pill border radius |

### Shadows

| Token | Value | Description |
|-------|-------|-------------|
| `--shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Small shadow |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Medium shadow |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Large shadow |

## Component Guidelines

### Buttons

Buttons use the following design tokens:

- Font: `--font-sans`
- Font size: `--text-sm` to `--text-md` depending on size
- Font weight: `--font-medium`
- Padding: Varies by size
  - Small: `--spacing-xs` vertical, `--spacing-sm` horizontal
  - Medium: `--spacing-sm` vertical, `--spacing-md` horizontal
  - Large: `--spacing-md` vertical, `--spacing-lg` horizontal
- Border radius: `--radius-md`
- Colors: Primary, secondary, or tertiary color scales

### Cards

Cards use consistent styling:

- Background: `--gray-50` or white
- Border: `1px solid --gray-200`
- Border radius: `--radius-lg`
- Padding: `--spacing-md` to `--spacing-lg`
- Shadow: `--shadow-sm` to `--shadow-md`

### Typography

Typography components use a consistent scale:

- Display: Very large text for hero sections
- Headings: h1-h6 with decreasing font sizes
- Body: Regular text in several sizes
- Labels: Smaller text for form labels and captions

Font sizes decrease and increase in a consistent ratio (1.125 or 1.2).

### Form Elements

Form elements share common patterns:

- Labels above inputs
- Consistent height for similar form elements
- Clear focus states with `--primary-500` outline
- Error states using `--error-500`
- Help text in `--gray-500`

## Component Variants

### Size Variants

Components typically offer three sizes:

- `sm`: Small/compact
- `md`: Medium/default
- `lg`: Large/prominent

### Color Variants

Most interactive components support these variants:

- `primary`: Main call-to-action
- `secondary`: Less prominent actions
- `tertiary`: Subtle actions

### State Variants

Components should have consistent states:

- Default
- Hover
- Focus
- Active
- Disabled

## Theme Support

All components support both light and dark themes:

- Light theme is the default
- Dark theme adjusts colors for darker backgrounds
- Colors maintain proper contrast in both themes
- Components should be tested in both themes

## Responsive Design

All components should be responsive:

- Flexible widths where appropriate
- Proper touch targets on mobile (minimum 44x44px)
- Adjustments for smaller screens where needed
- Consistent spacing and sizing across breakpoints 