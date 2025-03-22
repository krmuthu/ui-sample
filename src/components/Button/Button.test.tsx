import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from './Button';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

// Wrap components in ThemeProvider for testing
const renderWithTheme = (ui: React.ReactElement, { theme = 'light' } = {}) => {
  return render(
    <ThemeProvider defaultTheme={theme as 'light' | 'dark'}>
      {ui}
    </ThemeProvider>
  );
};

describe('Button Component', () => {
  it('renders with default props', () => {
    renderWithTheme(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    // Using CSS vars now, so we check for the CSS var class instead of direct colors
    expect(button).toHaveClass('bg-[var(--btn-primary-bg)]');
    expect(button).not.toBeDisabled();
  });

  it('applies different variants correctly', () => {
    const { rerender } = renderWithTheme(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--btn-primary-bg)]');

    rerender(
      <ThemeProvider>
        <Button variant="secondary">Secondary</Button>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--btn-secondary-bg)]');

    rerender(
      <ThemeProvider>
        <Button variant="tertiary">Tertiary</Button>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--btn-tertiary-bg)]');
  });

  it('applies theme-aware styles for all variants', () => {
    const { rerender } = renderWithTheme(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--btn-primary-bg)]');

    rerender(
      <ThemeProvider>
        <Button variant="primary-positive">Primary Positive</Button>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--btn-primary-positive-bg)]');

    rerender(
      <ThemeProvider>
        <Button variant="primary-negative">Primary Negative</Button>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--btn-primary-negative-bg)]');

    rerender(
      <ThemeProvider>
        <Button variant="tertiary-negative">Tertiary Negative</Button>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--btn-tertiary-negative-bg)]');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = renderWithTheme(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-xs');

    rerender(
      <ThemeProvider>
        <Button size="standard">Standard</Button>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveClass('text-sm');
  });

  it('handles disabled state correctly', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles loading state correctly', () => {
    renderWithTheme(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveClass('!text-transparent');
    expect(screen.getByRole('button')).toContainElement(
      document.querySelector('svg.animate-spin')
    );
  });

  it('handles full width correctly', () => {
    renderWithTheme(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('renders with start icon', () => {
    const startIcon = <span data-testid="start-icon">→</span>;
    renderWithTheme(<Button startIcon={startIcon}>With Start Icon</Button>);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders with end icon', () => {
    const endIcon = <span data-testid="end-icon">←</span>;
    renderWithTheme(<Button endIcon={endIcon}>With End Icon</Button>);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    renderWithTheme(<Button onClick={handleClick}>Clickable</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    renderWithTheme(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    const handleClick = vi.fn();
    renderWithTheme(<Button loading onClick={handleClick}>Loading</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('merges custom className with default styles', () => {
    renderWithTheme(<Button className="custom-class">Custom Style</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-[var(--btn-primary-bg)]');
  });

  it('passes through additional HTML button attributes', () => {
    renderWithTheme(
      <Button type="submit" name="submit-btn" value="submit">
        Submit
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'submit-btn');
    expect(button).toHaveAttribute('value', 'submit');
  });

  it('renders correctly in dark mode', () => {
    renderWithTheme(<Button>Dark Mode Button</Button>, { theme: 'dark' });
    const button = screen.getByRole('button', { name: /dark mode button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[var(--btn-primary-bg)]');
    // The CSS variables will have different values in dark mode
    // but the classes remain the same
  });
}); 