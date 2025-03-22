import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Link } from './Link';

describe('Link Component', () => {
  it('renders with default props', () => {
    render(<Link href="https://example.com">Click me</Link>);
    const link = screen.getByText('Click me');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('text-blue-600');
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(
      <Link href="https://example.com" variant="primary">
        Primary Link
      </Link>
    );
    expect(screen.getByText('Primary Link')).toHaveClass('text-primary-600');

    rerender(
      <Link href="https://example.com" variant="secondary">
        Secondary Link
      </Link>
    );
    expect(screen.getByText('Secondary Link')).toHaveClass('text-gray-600');
  });

  it('handles external links correctly', () => {
    render(
      <Link href="https://example.com" target="_blank">
        External Link
      </Link>
    );
    const link = screen.getByText('External Link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(
      <Link href="https://example.com" onClick={handleClick}>
        Clickable Link
      </Link>
    );
    
    const link = screen.getByText('Clickable Link');
    await userEvent.click(link);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('merges custom className with default styles', () => {
    render(
      <Link href="https://example.com" className="custom-class">
        Styled Link
      </Link>
    );
    const link = screen.getByText('Styled Link');
    expect(link).toHaveClass('custom-class');
    expect(link).toHaveClass('text-blue-600');
  });
}); 