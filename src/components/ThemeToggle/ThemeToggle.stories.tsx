import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ThemeToggle from './ThemeToggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['button', 'icon'],
      description: 'The variant of the theme toggle',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  args: {
    variant: 'button',
  },
};

export const IconVariant: Story = {
  args: {
    variant: 'icon',
  },
};

export const ThemeDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-6 rounded-lg bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Theme Demo</h2>
        <ThemeToggle variant="icon" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Primary Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <ThemeToggle />
            <button className="bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] px-4 py-2 rounded-md font-medium">
              Primary Button
            </button>
            <button className="bg-[var(--btn-primary-positive-bg)] hover:bg-[var(--btn-primary-positive-hover)] text-[var(--btn-primary-positive-text)] px-4 py-2 rounded-md font-medium">
              Positive Button
            </button>
            <button className="bg-[var(--btn-primary-negative-bg)] hover:bg-[var(--btn-primary-negative-hover)] text-[var(--btn-primary-negative-text)] px-4 py-2 rounded-md font-medium">
              Negative Button
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Secondary & Tertiary</h3>
          <div className="flex flex-wrap gap-3">
            <button className="bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] text-[var(--btn-secondary-text)] border border-[var(--btn-secondary-border)] px-4 py-2 rounded-md font-medium">
              Secondary
            </button>
            <button className="bg-[var(--btn-tertiary-bg)] hover:bg-[var(--btn-tertiary-hover)] text-[var(--btn-tertiary-text)] px-4 py-2 rounded-md font-medium">
              Tertiary
            </button>
            <button className="bg-[var(--btn-tertiary-negative-bg)] hover:bg-[var(--btn-tertiary-negative-hover)] text-[var(--btn-tertiary-negative-text)] px-4 py-2 rounded-md font-medium">
              Tertiary Negative
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-[var(--btn-secondary-bg)] p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-3">Content Card</h3>
        <p className="text-[var(--btn-secondary-text)]">
          This card adapts to the current theme. It demonstrates how you can
          use CSS variables to ensure your UI components are theme-aware.
          Try toggling the theme to see how it changes!
        </p>
      </div>
    </div>
  ),
}; 