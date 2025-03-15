import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('should render a switch input', () => {
    render(<Switch data-testid="switch" />);
    const switchInput = screen.getByTestId('switch');
    
    expect(switchInput).toBeInTheDocument();
    expect(switchInput.tagName).toBe('INPUT');
    expect(switchInput.type).toBe('checkbox');
  });

  it('should render with a label', () => {
    render(<Switch label="Test Label" data-testid="switch" />);
    
    const switchInput = screen.getByTestId('switch');
    const label = screen.getByText('Test Label');
    
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label.htmlFor).toBe(switchInput.id);
  });

  it('should handle checked state', () => {
    render(<Switch checked data-testid="switch" />);
    
    const switchInput = screen.getByTestId('switch');
    expect(switchInput).toBeChecked();
    
    const switchTrack = switchInput.nextSibling?.firstChild as HTMLElement;
    expect(switchTrack).toHaveClass('bg-[var(--btn-primary-bg)]');
  });

  it('should call onChange when clicked', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} data-testid="switch" />);
    
    const switchInput = screen.getByTestId('switch');
    fireEvent.click(switchInput);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state', () => {
    render(<Switch disabled data-testid="switch" />);
    const switchInput = screen.getByTestId('switch');
    
    expect(switchInput).toBeDisabled();
    const switchTrack = switchInput.nextSibling?.firstChild as HTMLElement;
    expect(switchTrack).toHaveClass('opacity-50');
  });

  it('should show helper text when provided', () => {
    render(<Switch helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(<Switch label="Required Field" required />);
    
    screen.getByText('Required Field');
    const requiredIndicator = screen.getByText('*');
    
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });
}); 