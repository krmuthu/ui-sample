import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popover } from './Popover';

describe('Popover Component', () => {
  it('renders trigger element without popover initially', () => {
    render(
      <Popover trigger={<button>Click me</button>}>
        <div>Popover content</div>
      </Popover>
    );

    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows popover on trigger click', () => {
    render(
      <Popover trigger={<button>Click me</button>}>
        <div>Popover content</div>
      </Popover>
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('closes popover when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Popover trigger={<button>Click me</button>}>
          <div>Popover content</div>
        </Popover>
      </div>
    );

    // Open popover
    fireEvent.click(screen.getByText('Click me'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not close popover when closeOnOutsideClick is false', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Popover trigger={<button>Click me</button>} closeOnOutsideClick={false}>
          <div>Popover content</div>
        </Popover>
      </div>
    );

    // Open popover
    fireEvent.click(screen.getByText('Click me'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders popover with title', () => {
    render(
      <Popover trigger={<button>Click me</button>} title="Popover Title">
        <div>Popover content</div>
      </Popover>
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(screen.getByText('Popover Title')).toBeInTheDocument();
  });

  it('renders popover with different placements', () => {
    const { rerender } = render(
      <Popover trigger={<button>Click me</button>} placement="top">
        <div>Popover content</div>
      </Popover>
    );

    // Open popover
    fireEvent.click(screen.getByText('Click me'));
    const popover = screen.getByRole('dialog');

    // Test different placements
    ['top', 'bottom', 'left', 'right'].forEach((placement) => {
      rerender(
        <Popover trigger={<button>Click me</button>} placement={placement as any}>
          <div>Popover content</div>
        </Popover>
      );

      expect(popover).toBeInTheDocument();
    });
  });

  it('handles controlled open state', () => {
    const onOpenChange = jest.fn();

    const { rerender } = render(
      <Popover
        trigger={<button>Click me</button>}
        isOpen={false}
        onOpenChange={onOpenChange}
      >
        <div>Popover content</div>
      </Popover>
    );

    // Popover should be closed initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click trigger
    fireEvent.click(screen.getByText('Click me'));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Rerender with isOpen={true}
    rerender(
      <Popover
        trigger={<button>Click me</button>}
        isOpen={true}
        onOpenChange={onOpenChange}
      >
        <div>Popover content</div>
      </Popover>
    );

    // Popover should be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders popover without arrow when arrow prop is false', () => {
    render(
      <Popover trigger={<button>Click me</button>} arrow={false}>
        <div>Popover content</div>
      </Popover>
    );

    fireEvent.click(screen.getByText('Click me'));
    const popover = screen.getByRole('dialog');
    expect(popover).toBeInTheDocument();
    expect(popover.querySelector('.border-solid')).not.toBeInTheDocument();
  });

  it('applies custom className to popover', () => {
    render(
      <Popover trigger={<button>Click me</button>} className="custom-class">
        <div>Popover content</div>
      </Popover>
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(screen.getByRole('dialog')).toHaveClass('custom-class');
  });
}); 