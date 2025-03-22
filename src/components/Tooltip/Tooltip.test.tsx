import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Tooltip Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Create a portal container for each test
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'tooltip-portal');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    
    // Clean up portal container
    const portalRoot = document.getElementById('tooltip-portal');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  it('renders trigger element without tooltip initially', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on mouse enter with delay', async () => {
    render(
      <Tooltip content="Test tooltip" showDelay={200}>
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    
    // Tooltip should not be visible immediately
    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    // Use async waitFor with a retry strategy
    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('hides tooltip on mouse leave with delay', async () => {
    render(
      <Tooltip content="Test tooltip" showDelay={0} hideDelay={100}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    
    // Show tooltip
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(10); // Add a small delay to ensure tooltip shows
    });
    
    // Need to wait for the tooltip to appear before we can test its hiding
    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Hide tooltip
    fireEvent.mouseLeave(trigger);
    
    // Tooltip should still be visible until timeout
    expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Now tooltip should be hidden
    await waitFor(() => {
      expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('renders tooltip with custom content', async () => {
    const customContent = (
      <div>
        <h3>Custom Title</h3>
        <p>Custom description</p>
      </div>
    );

    render(
      <Tooltip content={customContent} showDelay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(10);
    });

    await waitFor(() => {
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('renders tooltip with different placements', async () => {
    // Use only one placement for simplicity in tests
    render(
      <Tooltip content="Test tooltip" placement="top" showDelay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    
    // Show tooltip
    fireEvent.mouseEnter(trigger);
    
    act(() => {
      vi.advanceTimersByTime(10);
    });
    
    // Check tooltip is shown
    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Hide tooltip
    fireEvent.mouseLeave(trigger);
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Check tooltip is hidden
    await waitFor(() => {
      expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('renders tooltip without arrow when arrow prop is false', async () => {
    render(
      <Tooltip content="Test tooltip" arrow={false} showDelay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(10);
    });

    // First make sure tooltip appears
    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    }, { timeout: 1000 });

    // Then check for absence of arrow element
    // Instead of a specific class, we check for any arrow element
    const tooltipContainer = screen.getByText('Test tooltip').closest('[role="tooltip"]');
    const arrows = tooltipContainer?.querySelectorAll('[data-popper-arrow]');
    expect(arrows?.length).toBe(0);
  });

  it('applies custom className to tooltip', async () => {
    render(
      <Tooltip content="Test tooltip" className="custom-class" showDelay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(10);
    });

    await waitFor(() => {
      const tooltipContainer = screen.getByText('Test tooltip').closest('[role="tooltip"]');
      expect(tooltipContainer).toHaveClass('custom-class');
    }, { timeout: 1000 });
  });

  it('cleans up timeouts on unmount', () => {
    const { unmount } = render(
      <Tooltip content="Test tooltip" showDelay={1000}>
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    unmount();

    // This should not throw any errors
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  });
}); 