import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { describe, it, expect, vi } from 'vitest';

// Mock the Button component
vi.mock('../Button', () => ({
  Button: vi.fn(({ children, onClick, className, 'data-testid': testId, 'aria-label': ariaLabel, startIcon }) => (
    <button
      onClick={onClick}
      className={`mocked-button ${className || ''}`}
      data-testid={testId || 'button-component'}
      aria-label={ariaLabel}
    >
      {startIcon && <span data-testid="start-icon">{startIcon}</span>}
      {children}
    </button>
  ))
}));

describe('ThemeToggle Component', () => {
  it('renders as a button variant by default', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByTestId('button-component')).toBeInTheDocument();
  });

  it('renders as an icon when specified', () => {
    render(
      <ThemeProvider>
        <ThemeToggle variant="icon" />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('shows correct text based on current theme (light)', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByTestId('button-component')).toHaveTextContent('Dark Mode');
  });

  it('shows correct text based on current theme (dark)', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByTestId('button-component')).toHaveTextContent('Dark Mode');
  });

  it('toggles theme when clicked (button variant)', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    // Initially shows "Dark Mode" text
    expect(screen.getByTestId('button-component')).toHaveTextContent('Dark Mode');
    
    // Click to toggle
    fireEvent.click(screen.getByTestId('button-component'));
    
    // Now shows "Light Mode" text
    expect(screen.getByTestId('button-component')).toHaveTextContent('Light Mode');
  });

  it('toggles theme when clicked (icon variant)', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle variant="icon" />
      </ThemeProvider>
    );

    // Initially light theme, so moon icon aria-label
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    
    // Click to toggle
    fireEvent.click(button);
    
    // Now dark theme, so sun icon aria-label
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('applies custom className when provided', () => {
    render(
      <ThemeProvider>
        <ThemeToggle className="custom-class" />
      </ThemeProvider>
    );

    expect(screen.getByTestId('button-component')).toHaveClass('custom-class');
  });
}); 