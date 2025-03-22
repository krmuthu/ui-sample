import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination with correct number of pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders first and last page buttons by default', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByRole('button', { name: /first page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /last page/i })).toBeInTheDocument();
  });

  it('renders previous and next page buttons by default', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('disables first and previous buttons on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByRole('button', { name: /first page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });

  it('disables last and next buttons on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByRole('button', { name: /last page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  });

  it('calls onPageChange when clicking a page number', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('3'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking navigation buttons', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /first page/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByRole('button', { name: /last page/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it('renders without first and last buttons when showFirstLast is false', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showFirstLast={false}
      />
    );

    expect(screen.queryByRole('button', { name: /first page/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /last page/i })).not.toBeInTheDocument();
  });

  it('renders without previous and next buttons when showPrevNext is false', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showPrevNext={false}
      />
    );

    expect(screen.queryByRole('button', { name: /previous page/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next page/i })).not.toBeInTheDocument();
  });

  it('renders ellipsis when there are many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        pageRange={1}
      />
    );

    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('renders with custom page range', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        pageRange={3}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        size="sm"
      />
    );

    const smallButton = screen.getByRole('button', { name: '1' });
    expect(smallButton).toBeInTheDocument();
    expect(smallButton.closest('button')).toHaveClass('text-sm');

    rerender(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        size="lg"
      />
    );

    const largeButton = screen.getByRole('button', { name: '1' });
    expect(largeButton.closest('button')).toHaveClass('text-lg');
  });

  it('applies custom className', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        className="custom-class"
      />
    );

    expect(screen.getByRole('navigation')).toHaveClass('custom-class');
  });

  it('renders with default props', () => {
    render(<Pagination totalPages={10} currentPage={1} onPageChange={() => {}} />);
    
    const page1Button = screen.getByRole('button', { name: '1' });
    expect(page1Button).toHaveClass('bg-[var(--btn-primary-bg)]');
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toHaveAttribute('disabled');
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toHaveAttribute('disabled');
  });
  
  it('shows correct page range', () => {
    render(<Pagination totalPages={10} currentPage={5} onPageChange={() => {}} />);
    
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
  });
  
  it('calls onPageChange when page button clicked', () => {
    const onPageChangeMock = vi.fn();
    render(<Pagination totalPages={10} currentPage={5} onPageChange={onPageChangeMock} />);
    
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    
    expect(onPageChangeMock).toHaveBeenCalledWith(7);
  });
  
  it('calls onPageChange when next button clicked', () => {
    const onPageChangeMock = vi.fn();
    render(<Pagination totalPages={10} currentPage={5} onPageChange={onPageChangeMock} />);
    
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    expect(onPageChangeMock).toHaveBeenCalledWith(6);
  });
  
  it('calls onPageChange when previous button clicked', () => {
    const onPageChangeMock = vi.fn();
    render(<Pagination totalPages={10} currentPage={5} onPageChange={onPageChangeMock} />);
    
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    
    expect(onPageChangeMock).toHaveBeenCalledWith(4);
  });
  
  it('disables next button on last page', () => {
    render(<Pagination totalPages={10} currentPage={10} onPageChange={() => {}} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toHaveAttribute('disabled');
  });
  
  it('handles small number of pages correctly', () => {
    render(<Pagination totalPages={3} currentPage={2} onPageChange={() => {}} />);
    
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });
}); 