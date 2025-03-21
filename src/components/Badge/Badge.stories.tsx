import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge component description goes here...',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Visual variant of the component',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
      table: {
        defaultValue: { summary: false },
      },
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base Badge story
export const Default: Story = {
  args: {
    children: 'Badge Content',
    variant: 'default',
    size: 'md',
  },
};

// Variants
export const Primary: Story = {
  args: {
    children: 'Primary Badge',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Badge',
    variant: 'secondary',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small Badge',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Badge',
    size: 'lg',
  },
};

// States
export const Disabled: Story = {
  args: {
    children: 'Disabled Badge',
    disabled: true,
  },
};

// Example with complex content
export const WithCustomContent: Story = {
  args: {
    variant: 'primary',
    children: (
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span>Custom Content</span>
      </div>
    ),
  },
}; 