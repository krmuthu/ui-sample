import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from './ThemeProvider';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Helper component to access theme context values
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset the document element attributes
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    cleanup();
  });

  it('provides default light theme when nothing in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  it('uses theme from localStorage if available', () => {
    localStorageMock.getItem.mockReturnValueOnce('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('toggles theme when toggle function is called', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initial theme should be light
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    // Toggle to dark
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    // Toggle back to light
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('allows overriding default theme with prop', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('throws error if useTheme is used outside of ThemeProvider', () => {
    // Suppress console errors for this test
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleErrorMock.mockRestore();
  });
}); 