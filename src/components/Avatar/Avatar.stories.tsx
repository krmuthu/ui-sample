import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'The source URL for the avatar image',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the avatar image',
    },
    size: {
      control: 'select',
      options: ['xs', 'small', 'medium', 'large', 'xl'],
      description: 'The size of the avatar',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    shape: {
      control: 'select',
      options: ['circle', 'rounded', 'square'],
      description: 'The shape of the avatar',
      table: {
        defaultValue: { summary: 'circle' },
      },
    },
    initials: {
      control: 'text',
      description: 'Initials to display when no image is available',
    },
    name: {
      control: 'text',
      description: 'Name of the person (used to generate initials if none provided)',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'neutral'],
      description: 'Background color for the avatar when displaying initials',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy', 'none'],
      description: 'Status indicator',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
    bordered: {
      control: 'boolean',
      description: 'Whether to show a border around the avatar',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

/**
 * Basic avatar with image
 */
export const Default: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    alt: 'User avatar',
  },
};

/**
 * Avatar showing initials when no image is provided
 */
export const WithInitials: Story = {
  args: {
    initials: 'JD',
    color: 'primary',
  },
};

/**
 * Avatar with automatically generated initials from name
 */
export const GeneratedInitials: Story = {
  args: {
    name: 'John Doe',
    color: 'secondary',
  },
};

/**
 * Avatar with status indicator
 */
export const WithStatus: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    status: 'online',
  },
};

/**
 * Different avatar sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar size="xs" name="Extra Small" />
      <Avatar size="small" name="Small" />
      <Avatar size="medium" name="Medium" />
      <Avatar size="large" name="Large" />
      <Avatar size="xl" name="Extra Large" />
    </div>
  ),
};

/**
 * Different avatar shapes
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar shape="circle" name="Circle" />
      <Avatar shape="rounded" name="Rounded" />
      <Avatar shape="square" name="Square" />
    </div>
  ),
};

/**
 * Different background colors when showing initials
 */
export const Colors: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar color="primary" name="Primary" />
      <Avatar color="secondary" name="Secondary" />
      <Avatar color="success" name="Success" />
      <Avatar color="error" name="Error" />
      <Avatar color="warning" name="Warning" />
      <Avatar color="neutral" name="Neutral" />
    </div>
  ),
};

/**
 * Different status indicators
 */
export const StatusIndicators: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar name="Online" status="online" />
      <Avatar name="Offline" status="offline" />
      <Avatar name="Away" status="away" />
      <Avatar name="Busy" status="busy" />
      <Avatar name="None" status="none" />
    </div>
  ),
};

/**
 * Avatar with border
 */
export const Bordered: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    bordered: true,
  },
};

/**
 * Avatar with border and status
 */
export const BorderedWithStatus: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    bordered: true,
    status: 'online',
  },
};

/**
 * Avatar with fallback to initials when image fails to load
 */
export const ImageFallback: Story = {
  args: {
    src: 'https://invalid-image-url.com/image.jpg',
    name: 'John Doe',
  },
};

/**
 * Avatar group example
 */
export const AvatarGroup: Story = {
  render: () => (
    <div className="flex items-center -space-x-2">
      <Avatar 
        src="https://i.pravatar.cc/300?img=1" 
        bordered 
        className="z-30"
      />
      <Avatar 
        src="https://i.pravatar.cc/300?img=2" 
        bordered 
        className="z-20"
      />
      <Avatar 
        src="https://i.pravatar.cc/300?img=3" 
        bordered 
        className="z-10"
      />
      <Avatar 
        className="z-0 bg-neutral-100 text-neutral-800 border-2 border-white"
      >
        <span className="text-xs font-medium">+3</span>
      </Avatar>
    </div>
  ),
}; 