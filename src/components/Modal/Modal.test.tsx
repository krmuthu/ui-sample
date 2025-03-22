import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from './Modal';
import { Button } from '../Button';

// Mock the portal container
beforeEach(() => {
  // Create portal root
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'portal-root');
  document.body.appendChild(portalRoot);
});

afterEach(() => {
  // Clean up
  const portalRoot = document.getElementById('portal-root');
  if (portalRoot) {
    document.body.removeChild(portalRoot);
  }
  vi.restoreAllMocks();
});

// Create a custom Footer component for testing
const Footer = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="custom-footer">{children}</div>
);

describe('Modal', () => {
  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });
  
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  
  it('shows a close button by default', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });
  
  it('does not show close button when showCloseButton is false', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Test Modal" showCloseButton={false}>
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.queryByRole('button', { name: /close/i });
    expect(closeButton).not.toBeInTheDocument();
  });
  
  it('renders with different sizes', () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => {}} title="Test Modal" size="sm">
        <p>Modal content</p>
      </Modal>
    );
    
    let modalContainer = screen.getByRole('dialog');
    expect(modalContainer).toHaveClass('max-w-md');
    
    rerender(
      <Modal isOpen onClose={() => {}} title="Test Modal" size="md">
        <p>Modal content</p>
      </Modal>
    );
    
    modalContainer = screen.getByRole('dialog');
    expect(modalContainer).toHaveClass('max-w-2xl');
    
    rerender(
      <Modal isOpen onClose={() => {}} title="Test Modal" size="lg">
        <p>Modal content</p>
      </Modal>
    );
    
    modalContainer = screen.getByRole('dialog');
    expect(modalContainer).toHaveClass('max-w-4xl');
    
    rerender(
      <Modal isOpen onClose={() => {}} title="Test Modal" size="xl">
        <p>Modal content</p>
      </Modal>
    );
    
    modalContainer = screen.getByRole('dialog');
    expect(modalContainer).toHaveClass('max-w-4xl');
  });
  
  it('renders with a custom footer', () => {
    render(
      <Modal 
        isOpen 
        onClose={() => {}} 
        title="Test Modal"
      >
        <p>Modal content</p>
        <Footer>Custom Footer</Footer>
      </Modal>
    );
    
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
  });
  
  it('applies custom className', () => {
    render(
      <Modal 
        isOpen 
        onClose={() => {}} 
        title="Test Modal"
        data-testid="custom-modal"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    const modalContainer = screen.getByTestId('custom-modal');
    expect(modalContainer).toBeInTheDocument();
  });

  it('renders footer content when provided', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test Modal"
      >
        <p>Modal content</p>
        <Modal.Footer>
          <Button>Save</Button>
        </Modal.Footer>
      </Modal>
    );

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('shows content with loading state', () => {
    render(
      <div>
        <div role="status" aria-label="Loading">Loading spinner</div>
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      </div>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('closes when clicking outside by default', () => {
    const mockCloseFn = vi.fn();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Modal isOpen={true} onClose={mockCloseFn} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      </div>
    );

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(mockCloseFn).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking outside when closeOnOutsideClick is false', () => {
    const mockCloseFn = vi.fn();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Modal
          isOpen={true}
          onClose={mockCloseFn}
          title="Test Modal"
          closeOnOutsideClick={false}
        >
          <p>Modal content</p>
        </Modal>
      </div>
    );

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(mockCloseFn).not.toHaveBeenCalled();
  });

  it('renders with custom attributes', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test Modal"
        data-testid="custom-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByTestId('custom-modal')).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders with rich content', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div>
              <h4 className="font-medium">John Doe</h4>
              <p className="text-sm text-gray-600">Software Engineer</p>
            </div>
          </div>
        </div>
      </Modal>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });
}); 