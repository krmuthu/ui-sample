import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600'); // Default contained primary button
    expect(button).not.toBeDisabled();
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="contained">Contained</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="outlined">Outlined</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-blue-600');

    rerender(<Button variant="text">Text</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-blue-600');
  });

  it('applies different colors correctly', () => {
    const { rerender } = render(<Button color="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button color="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-purple-600');

    rerender(<Button color="success">Success</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-green-600');

    rerender(<Button color="error">Error</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-xs');

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-sm');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-base');
  });

  it('handles disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveClass('text-transparent');
    expect(screen.getByRole('button')).toContainElement(
      document.querySelector('svg.animate-spin')
    );
  });

  it('handles full width correctly', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('renders with start icon', () => {
    const startIcon = <span data-testid="start-icon">→</span>;
    render(<Button startIcon={startIcon}>With Start Icon</Button>);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders with end icon', () => {
    const endIcon = <span data-testid="end-icon">←</span>;
    render(<Button endIcon={endIcon}>With End Icon</Button>);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Loading</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('merges custom className with default styles', () => {
    render(<Button className="custom-class">Custom Style</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-blue-600'); // Should still have default styles
  });

  it('passes through additional HTML button attributes', () => {
    render(
      <Button type="submit" name="submit-btn" value="submit">
        Submit
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'submit-btn');
    expect(button).toHaveAttribute('value', 'submit');
  });
}); 