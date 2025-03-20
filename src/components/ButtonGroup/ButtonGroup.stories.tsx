import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ButtonGroup from './ButtonGroup';
import { Button } from '../Button';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the button group',
    },
    spacing: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The spacing between buttons',
    },
    connected: {
      control: 'boolean',
      description: 'Whether the buttons should be connected visually',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button group should take up the full width of its container',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

/**
 * Default button group with horizontal layout
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </>
    ),
  },
};

/**
 * Vertical button group
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    children: (
      <>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </>
    ),
  },
};

/**
 * Connected buttons without gap
 */
export const Connected: Story = {
  args: {
    connected: true,
    children: (
      <>
        <Button>Previous</Button>
        <Button>Current</Button>
        <Button>Next</Button>
      </>
    ),
  },
};

/**
 * Different spacing options
 */
export const Spacing: Story = {
  render: () => (
    <div className="flex flex-col gap-8 text-[var(--foreground)]">
      <div>
        <h3 className="mb-2 text-sm font-semibold">None</h3>
        <ButtonGroup spacing="none">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Compact</h3>
        <ButtonGroup spacing="compact">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Default</h3>
        <ButtonGroup spacing="default">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Loose</h3>
        <ButtonGroup spacing="loose">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Full width with different alignments
 */
export const FullWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-md text-[var(--foreground)]">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Left Aligned</h3>
        <ButtonGroup fullWidth align="left">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Center Aligned</h3>
        <ButtonGroup fullWidth align="center">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Right Aligned</h3>
        <ButtonGroup fullWidth align="right">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Space Between</h3>
        <ButtonGroup fullWidth align="between">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Different button variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 text-[var(--foreground)]">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Primary (Default)</h3>
        <ButtonGroup variant="primary">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Primary Positive</h3>
        <ButtonGroup variant="primary-positive">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Secondary</h3>
        <ButtonGroup variant="secondary">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Tertiary</h3>
        <ButtonGroup variant="tertiary">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 text-[var(--foreground)]">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Standard (Default)</h3>
        <ButtonGroup size="standard">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Small</h3>
        <ButtonGroup size="small">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Example: Pagination
 */
export const PaginationExample: Story = {
  args: {
    connected: true,
    variant: "secondary",
    size: 'small',
    children: (
      <>
        <Button>⟨</Button>
        <Button>1</Button>
        <Button variant="primary">2</Button>
        <Button>3</Button>
        <Button>⟩</Button>
      </>
    ),
  },
};

/**
 * Example: Toggle Buttons
 */
export const ToggleButtonsExample: Story = {
  render: () => {
    return (
      <ButtonGroup connected variant="secondary">
        <Button className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </Button>
        <Button className="flex items-center justify-center" variant="primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </Button>
      </ButtonGroup>
    );
  },
}; 