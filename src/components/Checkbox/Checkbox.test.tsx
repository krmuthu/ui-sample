import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

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
    const handleChange = jest.fn();
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

  it('should handle error state', () => {
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
    expect(requiredIndicator).toHaveClass('text-[var(--btn-primary-negative-bg)]');
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
}); 