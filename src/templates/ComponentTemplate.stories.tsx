import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentTemplate } from './ComponentTemplate';

const meta: Meta<typeof ComponentTemplate> = {
  title: 'Templates/ComponentTemplate',
  component: ComponentTemplate,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'The visual style of the component',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the component',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the component should take up the full width of its container',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the component is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentTemplate>;

// Base story with controls
export const Default: Story = {
  args: {
    children: 'Component Template',
    variant: 'primary',
    size: 'medium',
  },
};

// Variants showcase
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Component Variants</h3>
      <div className="flex flex-wrap gap-4">
        <ComponentTemplate variant="primary">Primary</ComponentTemplate>
        <ComponentTemplate variant="secondary">Secondary</ComponentTemplate>
        <ComponentTemplate variant="tertiary">Tertiary</ComponentTemplate>
      </div>
    </div>
  ),
};

// Sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Component Sizes</h3>
      <div className="flex items-center gap-4">
        <ComponentTemplate size="small">Small</ComponentTemplate>
        <ComponentTemplate size="medium">Medium</ComponentTemplate>
        <ComponentTemplate size="large">Large</ComponentTemplate>
      </div>
    </div>
  ),
};

// Full width showcase
export const FullWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Full Width Example</h3>
      <div className="flex flex-col gap-4 w-full">
        <ComponentTemplate fullWidth>Full Width</ComponentTemplate>
      </div>
    </div>
  ),
};

// With click handler
export const Interactive: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Interactive Example</h3>
      <div className="flex flex-wrap gap-4">
        <ComponentTemplate 
          onClick={() => alert('Component clicked!')}
          className="cursor-pointer hover:opacity-80"
        >
          Click Me
        </ComponentTemplate>
      </div>
    </div>
  ),
}; 