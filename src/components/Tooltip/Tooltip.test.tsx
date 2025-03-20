import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders trigger element without tooltip initially', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on mouse enter with delay', async () => {
    render(
      <Tooltip content="Test tooltip" showDelay={200}>
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    
    // Tooltip should not be visible immediately
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    
    // Fast-forward time
    jest.advanceTimersByTime(200);
    
    // Now tooltip should be visible
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
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
    jest.advanceTimersByTime(0);
    
    // Verify tooltip is shown
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    
    // Hide tooltip
    fireEvent.mouseLeave(trigger);
    
    // Tooltip should still be visible
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    
    // Fast-forward time
    jest.advanceTimersByTime(100);
    
    // Now tooltip should be hidden
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
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
    jest.advanceTimersByTime(0);

    await waitFor(() => {
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });
  });

  it('renders tooltip with different placements', async () => {
    const { rerender } = render(
      <Tooltip content="Test tooltip" placement="top" showDelay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    jest.advanceTimersByTime(0);

    // Test each placement
    ['top', 'bottom', 'left', 'right'].forEach((placement) => {
      rerender(
        <Tooltip content="Test tooltip" placement={placement as any} showDelay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('renders tooltip without arrow when arrow prop is false', async () => {
    render(
      <Tooltip content="Test tooltip" arrow={false} showDelay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    jest.advanceTimersByTime(0);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip.querySelector('.border-solid')).not.toBeInTheDocument();
    });
  });

  it('applies custom className to tooltip', async () => {
    render(
      <Tooltip content="Test tooltip" className="custom-class" showDelay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    jest.advanceTimersByTime(0);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveClass('custom-class');
    });
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
    jest.advanceTimersByTime(1000);
  });
}); 