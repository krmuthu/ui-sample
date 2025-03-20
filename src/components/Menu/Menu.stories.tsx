import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Menu, MenuItem } from './Menu';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menu>;

const MenuDemo = () => {
  return (
    <div className="p-16">
      <Menu
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Open Menu
          </button>
        }
      >
        <MenuItem onClick={() => console.log('Profile clicked')}>Profile</MenuItem>
        <MenuItem onClick={() => console.log('Settings clicked')}>Settings</MenuItem>
        <MenuItem onClick={() => console.log('Help clicked')}>Help</MenuItem>
        <MenuItem onClick={() => console.log('Logout clicked')} className="text-red-600">
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export const Basic: Story = {
  render: () => <MenuDemo />,
};

export const WithIcons: Story = {
  render: () => (
    <div className="p-16">
      <Menu
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Menu with Icons
          </button>
        }
      >
        <MenuItem
          icon={<span className="material-icons text-gray-500">person</span>}
          onClick={() => console.log('Profile clicked')}
        >
          Profile
        </MenuItem>
        <MenuItem
          icon={<span className="material-icons text-gray-500">settings</span>}
          onClick={() => console.log('Settings clicked')}
        >
          Settings
        </MenuItem>
        <MenuItem
          icon={<span className="material-icons text-gray-500">help</span>}
          onClick={() => console.log('Help clicked')}
        >
          Help
        </MenuItem>
        <MenuItem
          icon={<span className="material-icons text-red-500">logout</span>}
          onClick={() => console.log('Logout clicked')}
          className="text-red-600"
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <div className="p-16">
      <Menu
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Menu with Disabled Items
          </button>
        }
      >
        <MenuItem onClick={() => console.log('Profile clicked')}>Profile</MenuItem>
        <MenuItem onClick={() => console.log('Settings clicked')} disabled>
          Settings (Disabled)
        </MenuItem>
        <MenuItem onClick={() => console.log('Help clicked')}>Help</MenuItem>
        <MenuItem onClick={() => console.log('Logout clicked')} disabled>
          Logout (Disabled)
        </MenuItem>
      </Menu>
    </div>
  ),
};

export const WithSelectedItem: Story = {
  render: () => (
    <div className="p-16">
      <Menu
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Menu with Selected Item
          </button>
        }
      >
        <MenuItem onClick={() => console.log('Profile clicked')}>Profile</MenuItem>
        <MenuItem onClick={() => console.log('Settings clicked')} selected>
          Settings (Selected)
        </MenuItem>
        <MenuItem onClick={() => console.log('Help clicked')}>Help</MenuItem>
        <MenuItem onClick={() => console.log('Logout clicked')}>Logout</MenuItem>
      </Menu>
    </div>
  ),
};

export const DifferentPlacements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-16">
      <Menu
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Top Placement
          </button>
        }
        placement="top"
      >
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </Menu>
      <Menu
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Bottom Placement
          </button>
        }
        placement="bottom"
      >
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </Menu>
      <Menu
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Left Placement
          </button>
        }
        placement="left"
      >
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </Menu>
      <Menu
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Right Placement
          </button>
        }
        placement="right"
      >
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </Menu>
    </div>
  ),
}; 