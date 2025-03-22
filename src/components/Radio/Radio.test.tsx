import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Radio } from './Radio';
import { vi } from 'vitest';

describe('Radio Component', () => {
  it('should render a radio input', () => {
    render(<Radio data-testid="radio" />);
    expect(screen.getByTestId('radio')).toBeInTheDocument();
  });

  it('should render a label when provided', () => {
    render(<Radio label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should handle checked state', () => {
    render(<Radio checked={true} data-testid="radio" />);
    expect(screen.getByTestId('radio')).toBeChecked();
  });

  it('should handle change events', () => {
    const handleChange = vi.fn();
    render(<Radio onChange={handleChange} data-testid="radio" />);
    
    fireEvent.click(screen.getByTestId('radio'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should apply different sizes', () => {
    const { rerender } = render(<Radio size="small" data-testid="radio" />);
    expect(screen.getByTestId('radio')).toHaveClass('h-4');
    
    rerender(<Radio size="medium" data-testid="radio" />);
    expect(screen.getByTestId('radio')).toHaveClass('h-5');
    
    rerender(<Radio size="large" data-testid="radio" />);
    expect(screen.getByTestId('radio')).toHaveClass('h-6');
  });

  it('should apply variant classes', () => {
    const { rerender } = render(<Radio variant="primary" data-testid="radio" />);
    expect(screen.getByTestId('radio')).toHaveClass('text-[var(--btn-primary-bg)]');
    
    rerender(<Radio variant="secondary" data-testid="radio" />);
    expect(screen.getByTestId('radio')).toHaveClass('text-[var(--btn-secondary-bg)]');
  });

  it('should handle disabled state', () => {
    render(<Radio disabled data-testid="radio" />);
    const radio = screen.getByTestId('radio');
    
    expect(radio).toBeDisabled();
    expect(radio).toHaveClass('opacity-50');
  });

  it('should handle error state', () => {
    render(<Radio error errorMessage="Error message" data-testid="radio" />);
    
    expect(screen.getByTestId('radio')).toHaveClass('border-red-500');
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should show helper text when provided', () => {
    render(<Radio helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('should prioritize error message over helper text when both are provided', () => {
    render(<Radio error errorMessage="Error message" helperText="Helper text" />);
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(<Radio label="Required Field" required />);
    
    screen.getByText('Required Field');
    const requiredIndicator = screen.getByText('*');
    
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  it('should position label correctly based on labelPlacement', () => {
    const { rerender } = render(<Radio label="Test Label" labelPlacement="end" />);
    let labelContainer = screen.getByText('Test Label').closest('div');
    expect(labelContainer).toHaveClass('flex items-center');
    expect(labelContainer).not.toHaveClass('flex-row-reverse');
    
    rerender(<Radio label="Test Label" labelPlacement="start" />);
    labelContainer = screen.getByText('Test Label').closest('div');
    expect(labelContainer).toHaveClass('flex-row-reverse');
  });

  it('should handle name and value props correctly', () => {
    render(<Radio name="options" value="option1" data-testid="radio" />);
    const radio = screen.getByTestId('radio');
    
    expect(radio).toHaveAttribute('name', 'options');
    expect(radio).toHaveAttribute('value', 'option1');
  });
}); 