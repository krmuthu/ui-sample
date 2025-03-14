import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

// Define proper interface for mocked button props
interface MockedButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  startIcon?: React.ReactNode;
}

describe('ThemeToggle Component', () => {
  // Mock the Button component to simplify tests
  vi.mock('../Button/Button', () => ({
    default: ({ children, onClick, className, startIcon }: MockedButtonProps) => (
      <button
        onClick={onClick}
        className={`mocked-button ${className || ''}`}
        data-testid="button-component"
      >
        {startIcon && <span data-testid="start-icon">{startIcon}</span>}
        {children}
      </button>
    ),
  }));

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

    expect(screen.getByTestId('button-component')).toHaveTextContent('Light Mode');
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
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    
    // Click to toggle
    fireEvent.click(button);
    
    // Now dark theme, so sun icon aria-label
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
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