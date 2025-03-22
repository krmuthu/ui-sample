import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('Checkbox Component', () => {
  it('should render a checkbox input', () => {
    render(<Checkbox data-testid="checkbox" />);
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  it('should render a label when provided', () => {
    render(<Checkbox label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should handle checked state', () => {
    render(<Checkbox checked={true} data-testid="checkbox" />);
    expect(screen.getByTestId('checkbox')).toBeChecked();
  });

  it('should handle change events', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} data-testid="checkbox" />);
    
    fireEvent.click(screen.getByTestId('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should apply different sizes', () => {
    const { rerender } = render(<Checkbox size="small" data-testid="checkbox" />);
    expect(screen.getByTestId('checkbox')).toHaveClass('h-4');
    
    rerender(<Checkbox size="medium" data-testid="checkbox" />);
    expect(screen.getByTestId('checkbox')).toHaveClass('h-5');
    
    rerender(<Checkbox size="large" data-testid="checkbox" />);
    expect(screen.getByTestId('checkbox')).toHaveClass('h-6');
  });

  it('should apply variant classes', () => {
    const { rerender } = render(<Checkbox variant="primary" data-testid="checkbox" />);
    expect(screen.getByTestId('checkbox')).toHaveClass('text-[var(--btn-primary-bg)]');
    
    rerender(<Checkbox variant="secondary" data-testid="checkbox" />);
    expect(screen.getByTestId('checkbox')).toHaveClass('text-[var(--btn-secondary-bg)]');
  });

  it('should handle disabled state', () => {
    render(<Checkbox disabled data-testid="checkbox" />);
    const checkbox = screen.getByTestId('checkbox');
    
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('opacity-50');
  });

  it.skip('should handle error state', () => {
    render(<Checkbox error errorMessage="Error message" data-testid="checkbox" />);
    
    expect(screen.getByTestId('checkbox')).toHaveClass('border-[var(--btn-primary-negative-bg)]');
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should show helper text when provided', () => {
    render(<Checkbox helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('should prioritize error message over helper text when both are provided', () => {
    render(<Checkbox error errorMessage="Error message" helperText="Helper text" />);
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('should handle indeterminate state', () => {
    render(<Checkbox indeterminate data-testid="checkbox" />);
    const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
    
    expect(checkbox.indeterminate).toBe(true);
  });

  it('should show required indicator when required prop is true', () => {
    render(<Checkbox label="Required Field" required />);
    
    screen.getByText('Required Field');
    const requiredIndicator = screen.getByText('*');
    
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  it('should position label correctly based on labelPlacement', () => {
    const { rerender } = render(<Checkbox label="Test Label" labelPlacement="end" />);
    let labelContainer = screen.getByText('Test Label').parentElement;
    expect(labelContainer).toHaveClass('flex items-center');
    expect(labelContainer).not.toHaveClass('flex-row-reverse');
    
    rerender(<Checkbox label="Test Label" labelPlacement="start" />);
    labelContainer = screen.getByText('Test Label').parentElement;
    expect(labelContainer).toHaveClass('flex-row-reverse');
  });

  it('renders unchecked by default', () => {
    render(<Checkbox label="Test Checkbox" />);
    
    const checkbox = screen.getByRole('checkbox', { name: 'Test Checkbox' });
    expect(checkbox).not.toBeChecked();
  });
  
  it('can be initially checked', () => {
    render(<Checkbox label="Test Checkbox" checked />);
    
    const checkbox = screen.getByRole('checkbox', { name: 'Test Checkbox' });
    expect(checkbox).toBeChecked();
  });
  
  it('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Test Checkbox" onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox', { name: 'Test Checkbox' });
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    // The synthetic event should have checked: true
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({ checked: true })
    }));
  });
  
  it('can be disabled', () => {
    render(<Checkbox label="Test Checkbox" disabled />);
    
    const checkbox = screen.getByRole('checkbox', { name: 'Test Checkbox' });
    expect(checkbox).toBeDisabled();
  });
  
  it.skip('does not call onChange when clicked while disabled', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Test Checkbox" onChange={handleChange} disabled />);
    
    const checkbox = screen.getByRole('checkbox', { name: 'Test Checkbox' });
    fireEvent.click(checkbox);
    
    expect(handleChange).not.toHaveBeenCalled();
  });
  
  it('renders with different sizes', () => {
    const { rerender } = render(<Checkbox label="Small" size="small" data-testid="checkbox" />);
    
    let checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('w-4 h-4');
    
    rerender(<Checkbox label="Medium" size="medium" data-testid="checkbox" />);
    checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('w-5 h-5');
    
    rerender(<Checkbox label="Large" size="large" data-testid="checkbox" />);
    checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('w-6 h-6');
  });
  
  it('works as a controlled component', () => {
    const { rerender } = render(<Checkbox label="Test Checkbox" checked={false} />);
    
    const checkbox = screen.getByRole('checkbox', { name: 'Test Checkbox' });
    expect(checkbox).not.toBeChecked();
    
    rerender(<Checkbox label="Test Checkbox" checked={true} />);
    expect(checkbox).toBeChecked();
  });
  
  it('supports indeterminate state', () => {
    render(<Checkbox label="Test Checkbox" indeterminate />);
    
    const checkbox = screen.getByRole('checkbox', { name: 'Test Checkbox' });
    expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
  });
  
  it('renders label correctly', () => {
    render(<Checkbox label="Custom Label" />);
    
    const label = screen.getByText('Custom Label');
    expect(label).toBeInTheDocument();
  });
  
  it('renders error state correctly', () => {
    render(<Checkbox label="Error Checkbox" error errorMessage="This is an error" />);
    
    const errorMessage = screen.getByText('This is an error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-500');
  });
}); 