import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tag } from './Tag';

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
    const handleClick = jest.fn();
    render(<Tag text="TypeScript" onClick={handleClick} />);
    fireEvent.click(screen.getByText('TypeScript'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when clicked as a link', () => {
    const handleClick = jest.fn();
    render(<Tag text="JavaScript" isLink href="/tags/javascript" onClick={handleClick} />);
    fireEvent.click(screen.getByText('JavaScript'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with custom color', () => {
    render(<Tag text="Success" color="success" data-testid="tag" />);
    const tagElement = screen.getByTestId('tag');
    // This assumes the Chip component adds a class based on the color
    expect(tagElement).toHaveClass('success');
  });

  it('renders as removable when removable prop is true', () => {
    const handleRemove = jest.fn();
    render(<Tag text="Remove Me" removable onRemove={handleRemove} />);
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
}); 