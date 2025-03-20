import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Icon>;

// Example custom icon for demonstrating custom component support
const CustomIcon = ({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

export const Default: Story = {
  args: {
    icon: 'user',
  },
};

export const BuiltInIcons: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <Icon icon="close" aria-label="Close" />
      <Icon icon="user" aria-label="User" />
      <Icon icon="settings" aria-label="Settings" />
      <Icon icon="check" aria-label="Check" />
      <Icon icon="chevron-right" aria-label="Chevron Right" />
      <Icon icon="chevron-left" aria-label="Chevron Left" />
      <Icon icon="chevron-up" aria-label="Chevron Up" />
      <Icon icon="chevron-down" aria-label="Chevron Down" />
      <Icon icon="plus" aria-label="Plus" />
      <Icon icon="minus" aria-label="Minus" />
      <Icon icon="search" aria-label="Search" />
      <Icon icon="trash" aria-label="Trash" />
      <Icon icon="edit" aria-label="Edit" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="user" size="xs" />
      <Icon icon="user" size="sm" />
      <Icon icon="user" size="md" />
      <Icon icon="user" size="lg" />
      <Icon icon="user" size="xl" />
      <Icon icon="user" size="2xl" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="user" color="gray-500" />
      <Icon icon="user" color="blue-500" />
      <Icon icon="user" color="red-500" />
      <Icon icon="user" color="green-500" />
    </div>
  ),
};

export const StrokeWidth: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="user" strokeWidth={1} />
      <Icon icon="user" strokeWidth={2} />
      <Icon icon="user" strokeWidth={3} />
    </div>
  ),
};

export const Filled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="user" fill="none" />
      <Icon icon="user" fill="blue-500" />
      <Icon icon="user" fill="red-500" />
      <Icon icon="user" fill="green-500" />
    </div>
  ),
};

export const Rotated: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="chevron-right" rotate={0} />
      <Icon icon="chevron-right" rotate={90} />
      <Icon icon="chevron-right" rotate={180} />
      <Icon icon="chevron-right" rotate={270} />
    </div>
  ),
};

export const Animated: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="settings" animation="spin" />
      <Icon icon="user" animation="pulse" />
      <Icon icon="chevron-up" animation="bounce" />
      <Icon icon="plus" animation="ping" />
    </div>
  ),
};

export const CustomComponent: Story = {
  args: {
    icon: CustomIcon,
    color: 'blue-500',
  },
}; 