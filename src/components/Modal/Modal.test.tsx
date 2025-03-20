import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from './Modal';
import { Button } from '../Button';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders without close button when showCloseButton is false', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        showCloseButton={false}
      >
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('renders footer content when provided', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        footer={<Button>Save</Button>}
      >
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" isLoading={true}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" size="sm">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toHaveClass('max-w-sm');

    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" size="lg">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toHaveClass('max-w-lg');
  });

  it('closes when clicking outside by default', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      </div>
    );

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking outside when closeOnOutsideClick is false', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Modal
          isOpen={true}
          onClose={mockOnClose}
          title="Test Modal"
          closeOnOutsideClick={false}
        >
          <p>Modal content</p>
        </Modal>
      </div>
    );

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        className="custom-class"
      >
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toHaveClass('custom-class');
  });

  it('renders without title', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders with rich content', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
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