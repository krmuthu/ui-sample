import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'primary-positive', 'primary-negative', 'secondary', 'tertiary', 'tertiary-negative'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['standard', 'small'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take up the full width of its container',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Base story with controls
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'standard',
  },
};

// Variants showcase
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Button Variants</h3>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="primary-positive">Primary Positive</Button>
        <Button variant="primary-negative">Primary Negative</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="tertiary-negative">Tertiary Negative</Button>
      </div>
    </div>
  ),
};

// Sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Button Sizes</h3>
      <div className="flex items-center gap-4">
        <Button size="standard">Standard</Button>
        <Button size="small">Small</Button>
      </div>
    </div>
  ),
};

// States showcase
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Button States</h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button disabled loading>Disabled & Loading</Button>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" disabled>Disabled</Button>
          <Button variant="secondary" loading>Loading</Button>
        </div>
        <div className="flex gap-4">
          <Button variant="tertiary" disabled>Disabled</Button>
          <Button variant="tertiary" loading>Loading</Button>
        </div>
      </div>
    </div>
  ),
};

// Full width showcase
export const FullWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Full Width Buttons</h3>
      <div className="flex flex-col gap-4">
        <Button fullWidth>Full Width Primary</Button>
        <Button fullWidth variant="secondary">Full Width Secondary</Button>
        <Button fullWidth variant="tertiary">Full Width Tertiary</Button>
      </div>
    </div>
  ),
};

// With icons showcase
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Buttons with Icons</h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Button
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          >
            Search
          </Button>
          <Button
            endIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            }
          >
            Next
          </Button>
        </div>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Item
          </Button>
          <Button
            variant="tertiary-negative"
            endIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  ),
}; 