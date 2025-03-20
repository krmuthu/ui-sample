import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Menu, MenuItem } from './Menu';

describe('Menu Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders trigger button and opens menu on click', () => {
    render(
      <Menu trigger={<button>Open Menu</button>}>
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
      </Menu>
    );

    // Check if trigger is rendered
    const trigger = screen.getByText('Open Menu');
    expect(trigger).toBeInTheDocument();

    // Menu should be closed initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Click trigger to open menu
    fireEvent.click(trigger);

    // Menu should be open
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('closes menu when clicking outside', async () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Menu trigger={<button>Open Menu</button>}>
          <MenuItem>Item 1</MenuItem>
        </Menu>
      </div>
    );

    // Open menu
    fireEvent.click(screen.getByText('Open Menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));

    // Menu should close
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('handles disabled menu items correctly', () => {
    render(
      <Menu trigger={<button>Open Menu</button>}>
        <MenuItem onClick={mockOnClick}>Enabled Item</MenuItem>
        <MenuItem onClick={mockOnClick} disabled>
          Disabled Item
        </MenuItem>
      </Menu>
    );

    // Open menu
    fireEvent.click(screen.getByText('Open Menu'));

    // Click enabled item
    fireEvent.click(screen.getByText('Enabled Item'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    // Click disabled item
    fireEvent.click(screen.getByText('Disabled Item'));
    expect(mockOnClick).toHaveBeenCalledTimes(1); // Count should not increase
  });

  it('renders menu items with icons', () => {
    render(
      <Menu trigger={<button>Open Menu</button>}>
        <MenuItem icon={<span data-testid="icon">🔍</span>}>Search</MenuItem>
      </Menu>
    );

    // Open menu
    fireEvent.click(screen.getByText('Open Menu'));

    // Check if icon is rendered
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('handles controlled open state', () => {
    const onOpenChange = jest.fn();

    const { rerender } = render(
      <Menu
        trigger={<button>Open Menu</button>}
        isOpen={false}
        onOpenChange={onOpenChange}
      >
        <MenuItem>Item 1</MenuItem>
      </Menu>
    );

    // Menu should be closed initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Click trigger
    fireEvent.click(screen.getByText('Open Menu'));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Rerender with isOpen={true}
    rerender(
      <Menu
        trigger={<button>Open Menu</button>}
        isOpen={true}
        onOpenChange={onOpenChange}
      >
        <MenuItem>Item 1</MenuItem>
      </Menu>
    );

    // Menu should be open
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders menu with different placements', () => {
    const { rerender } = render(
      <Menu trigger={<button>Open Menu</button>} placement="top">
        <MenuItem>Item 1</MenuItem>
      </Menu>
    );

    // Open menu
    fireEvent.click(screen.getByText('Open Menu'));
    const menu = screen.getByRole('menu');

    // Test different placements
    ['top', 'bottom', 'left', 'right'].forEach((placement) => {
      rerender(
        <Menu trigger={<button>Open Menu</button>} placement={placement as any}>
          <MenuItem>Item 1</MenuItem>
        </Menu>
      );

      expect(menu).toBeInTheDocument();
    });
  });

  it('handles selected menu items correctly', () => {
    render(
      <Menu trigger={<button>Open Menu</button>}>
        <MenuItem selected>Selected Item</MenuItem>
        <MenuItem>Normal Item</MenuItem>
      </Menu>
    );

    // Open menu
    fireEvent.click(screen.getByText('Open Menu'));

    // Check if selected item has the correct class
    const selectedItem = screen.getByText('Selected Item');
    expect(selectedItem.parentElement).toHaveClass('bg-blue-50');
  });
}); 