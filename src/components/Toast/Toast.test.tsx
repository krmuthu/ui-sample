import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toast, ToastProvider, useToast } from './Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    const toast = useToast();
    return (
      <button onClick={() => toast.show({ title: 'Test Toast', message: 'Test Message' })}>
        Show Toast
      </button>
    );
  };

  it('renders toast when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('supports different variants', () => {
    render(
      <ToastProvider>
        <Toast
          id="test"
          title="Success Toast"
          message="Operation successful"
          variant="success"
        />
        <Toast
          id="test2"
          title="Error Toast"
          message="Operation failed"
          variant="error"
        />
      </ToastProvider>
    );

    const successToast = screen.getByText('Success Toast').closest('.toast');
    const errorToast = screen.getByText('Error Toast').closest('.toast');

    expect(successToast).toHaveClass('toast--success');
    expect(errorToast).toHaveClass('toast--error');
  });

  it('auto-closes after duration', () => {
    const onClose = jest.fn();
    render(
      <ToastProvider>
        <Toast
          id="test"
          title="Auto-close Toast"
          message="Will close soon"
          duration={3000}
          onClose={onClose}
        />
      </ToastProvider>
    );

    expect(screen.getByText('Auto-close Toast')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('can be manually dismissed', () => {
    const onClose = jest.fn();
    render(
      <ToastProvider>
        <Toast
          id="test"
          title="Dismissible Toast"
          message="Click to dismiss"
          dismissible
          onClose={onClose}
        />
      </ToastProvider>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders action button when provided', () => {
    const onAction = jest.fn();
    render(
      <ToastProvider>
        <Toast
          id="test"
          title="Action Toast"
          message="Has action"
          action={{
            label: 'Click Me',
            onClick: onAction,
          }}
        />
      </ToastProvider>
    );

    const actionButton = screen.getByText('Click Me');
    fireEvent.click(actionButton);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('shows progress bar when enabled', () => {
    render(
      <ToastProvider>
        <Toast
          id="test"
          title="Progress Toast"
          message="With progress"
          showProgress
          duration={5000}
        />
      </ToastProvider>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('supports different sizes', () => {
    render(
      <ToastProvider>
        <Toast
          id="test1"
          title="Small Toast"
          message="Small size"
          size="small"
        />
        <Toast
          id="test2"
          title="Large Toast"
          message="Large size"
          size="large"
        />
      </ToastProvider>
    );

    const smallToast = screen.getByText('Small Toast').closest('.toast');
    const largeToast = screen.getByText('Large Toast').closest('.toast');

    expect(smallToast).toHaveClass('toast--small');
    expect(largeToast).toHaveClass('toast--large');
  });

  it('supports different placements', () => {
    const { container } = render(
      <ToastProvider placement="top-right">
        <Toast
          id="test"
          title="Placed Toast"
          message="Top right"
        />
      </ToastProvider>
    );

    const toastContainer = container.querySelector('.fixed');
    expect(toastContainer).toHaveClass('top-right');
  });

  it('limits number of toasts', () => {
    const TestComponent = () => {
      const toast = useToast();
      const showMultipleToasts = () => {
        for (let i = 0; i < 6; i++) {
          toast.show({
            title: `Toast ${i}`,
            message: `Message ${i}`,
          });
        }
      };
      return <button onClick={showMultipleToasts}>Show Multiple Toasts</button>;
    };

    render(
      <ToastProvider maxToasts={5}>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Multiple Toasts'));
    const toasts = screen.getAllByText(/Toast \d/);
    expect(toasts).toHaveLength(5);
  });

  it('updates existing toast', () => {
    const TestComponent = () => {
      const toast = useToast();
      const updateToast = () => {
        const id = toast.show({
          title: 'Initial Toast',
          message: 'Initial message',
        });
        setTimeout(() => {
          toast.update(id, {
            title: 'Updated Toast',
            message: 'Updated message',
          });
        }, 1000);
      };
      return <button onClick={updateToast}>Update Toast</button>;
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Update Toast'));
    expect(screen.getByText('Initial Toast')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Updated Toast')).toBeInTheDocument();
    expect(screen.getByText('Updated message')).toBeInTheDocument();
  });

  it('clears all toasts', () => {
    const TestComponent = () => {
      const toast = useToast();
      return (
        <>
          <button
            onClick={() => {
              toast.show({ title: 'Toast 1', message: 'Message 1' });
              toast.show({ title: 'Toast 2', message: 'Message 2' });
            }}
          >
            Show Toasts
          </button>
          <button onClick={() => toast.clear()}>Clear All</button>
        </>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toasts'));
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Clear All'));
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
  });
}); 