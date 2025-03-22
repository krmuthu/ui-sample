import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Dialog } from './Dialog';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

// Mock createPortal to make testing portals possible
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

// Wrap components in ThemeProvider for testing
const renderWithTheme = (ui: React.ReactElement, { theme = 'light' } = {}) => {
  return render(
    <ThemeProvider defaultTheme={theme as 'light' | 'dark'}>
      {ui}
    </ThemeProvider>
  );
};

describe('Dialog Component', () => {
  beforeEach(() => {
    // Create a div to serve as the portal container for tests
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    // Clean up the portal container after each test
    const portalRoot = document.getElementById('portal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
    vi.resetAllMocks();
  });

  it('renders nothing when closed', () => {
    renderWithTheme(
      <Dialog open={false} onClose={() => {}} title="Test Dialog">
        <p>Dialog Content</p>
      </Dialog>
    );
    
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });

  it('renders correctly when open', () => {
    renderWithTheme(
      <Dialog open={true} onClose={() => {}} title="Test Dialog">
        <p>Dialog Content</p>
      </Dialog>
    );
    
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    renderWithTheme(
      <Dialog open={true} onClose={handleClose} title="Test Dialog">
        <p>Dialog Content</p>
      </Dialog>
    );
    
    const closeButton = screen.getByLabelText('Close dialog');
    await userEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop if closeOnBackdropClick is true', async () => {
    const handleClose = vi.fn();
    renderWithTheme(
      <Dialog open={true} onClose={handleClose} closeOnBackdropClick={true}>
        <p>Dialog Content</p>
      </Dialog>
    );
    
    // Find the backdrop by its class and role
    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClose when clicking the backdrop if closeOnBackdropClick is false', async () => {
    const handleClose = vi.fn();
    renderWithTheme(
      <Dialog open={true} onClose={handleClose} closeOnBackdropClick={false}>
        <p>Dialog Content</p>
      </Dialog>
    );
    
    // Find the backdrop by its class and role
    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).not.toHaveBeenCalled();
    }
  });

  it('calls onClose when Escape key is pressed if closeOnEsc is true', () => {
    const handleClose = vi.fn();
    renderWithTheme(
      <Dialog open={true} onClose={handleClose} closeOnEsc={true}>
        <p>Dialog Content</p>
      </Dialog>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape key is pressed if closeOnEsc is false', () => {
    const handleClose = vi.fn();
    renderWithTheme(
      <Dialog open={true} onClose={handleClose} closeOnEsc={false}>
        <p>Dialog Content</p>
      </Dialog>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = renderWithTheme(
      <Dialog open={true} onClose={() => {}} size="small">
        <p>Dialog Content</p>
      </Dialog>
    );
    
    expect(screen.getByRole('dialog')).toHaveClass('max-w-md');
    
    rerender(
      <ThemeProvider>
        <Dialog open={true} onClose={() => {}} size="medium">
          <p>Dialog Content</p>
        </Dialog>
      </ThemeProvider>
    );
    expect(screen.getByRole('dialog')).toHaveClass('max-w-2xl');
    
    rerender(
      <ThemeProvider>
        <Dialog open={true} onClose={() => {}} size="large">
          <p>Dialog Content</p>
        </Dialog>
      </ThemeProvider>
    );
    expect(screen.getByRole('dialog')).toHaveClass('max-w-4xl');
  });

  it('renders footer content when provided', () => {
    renderWithTheme(
      <Dialog 
        open={true} 
        onClose={() => {}} 
        title="Test Dialog"
        footer={<button>Close</button>}
      >
        <p>Dialog Content</p>
      </Dialog>
    );
    
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('applies custom className to the dialog', () => {
    renderWithTheme(
      <Dialog 
        open={true} 
        onClose={() => {}} 
        className="custom-class"
      >
        <p>Dialog Content</p>
      </Dialog>
    );
    
    expect(screen.getByRole('dialog')).toHaveClass('custom-class');
  });

  it('uses provided IDs for accessibility', () => {
    renderWithTheme(
      <Dialog 
        open={true} 
        onClose={() => {}} 
        id="custom-dialog-id"
        titleId="custom-title-id"
        descriptionId="custom-description-id"
        title="Test Dialog"
      >
        <p>Dialog Content</p>
      </Dialog>
    );
    
    expect(screen.getByRole('dialog')).toHaveAttribute('id', 'custom-dialog-id');
    expect(screen.getByText('Test Dialog')).toHaveAttribute('id', 'custom-title-id');
    expect(screen.getByText('Dialog Content').parentElement).toHaveAttribute('id', 'custom-description-id');
  });
}); 