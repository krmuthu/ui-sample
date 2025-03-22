import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tag } from './Tag';
import { vi, describe, it, expect } from 'vitest';

describe('Tag Component', () => {
  it('renders text correctly', () => {
    render(<Tag text="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders with hash prefix when hasHashPrefix is true', () => {
    render(<Tag text="javascript" hasHashPrefix />);
    expect(screen.getByText('#javascript')).toBeInTheDocument();
  });

  it('renders as a link when isLink is true and href is provided', () => {
    render(<Tag text="react" isLink href="/tags/react" />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/tags/react');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Tag text="TypeScript" onClick={handleClick} />);
    fireEvent.click(screen.getByText('TypeScript'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when clicked as a link', () => {
    const handleClick = vi.fn();
    render(<Tag text="JavaScript" isLink href="/tags/javascript" onClick={handleClick} />);
    fireEvent.click(screen.getByText('JavaScript'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with custom color', () => {
    render(<Tag text="Success" color="success" data-testid="tag" />);
    const tagElement = screen.getByTestId('tag');
    // Check for bg-green-100 which is part of the success color in soft variant
    expect(tagElement).toHaveClass('bg-green-100');
    expect(tagElement).toHaveClass('text-green-800');
  });

  it('renders with a close icon when children are provided', () => {
    const handleRemove = vi.fn();
    render(
      <Tag text="Remove Me">
        <button onClick={handleRemove}>x</button>
      </Tag>
    );
    const removeButton = screen.getByText('x');
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
}); 