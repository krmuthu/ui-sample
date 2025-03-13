import type { Meta, StoryObj } from '@storybook/react';
import ButtonGroup from './ButtonGroup';
import Button from '../Button/Button';

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
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    spacing: {
      control: 'select',
      options: ['none', 'compact', 'default', 'loose'],
      description: 'The spacing between buttons',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
      description: 'The variant style to apply to all buttons',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error'],
      description: 'The color theme to apply to all buttons',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'The size to apply to all buttons',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether buttons take full width',
      table: {
        defaultValue: { summary: false },
      },
    },
    connected: {
      control: 'boolean',
      description: 'Whether buttons are connected without gap',
      table: {
        defaultValue: { summary: false },
      },
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'between', 'around'],
      description: 'Horizontal alignment when fullWidth is true',
      table: {
        defaultValue: { summary: 'left' },
      },
    },
    children: {
      control: { type: null },
      description: 'The button components to render',
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
    <div className="flex flex-col gap-8">
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
    <div className="flex flex-col gap-8 w-full max-w-md">
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
 * Overriding button variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Contained (Default)</h3>
        <ButtonGroup variant="contained">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Outlined</h3>
        <ButtonGroup variant="outlined">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Text</h3>
        <ButtonGroup variant="text">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Different button colors
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Primary</h3>
        <ButtonGroup color="primary">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Secondary</h3>
        <ButtonGroup color="secondary">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Success</h3>
        <ButtonGroup color="success">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Error</h3>
        <ButtonGroup color="error">
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
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Small</h3>
        <ButtonGroup size="small">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Medium (Default)</h3>
        <ButtonGroup size="medium">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-semibold">Large</h3>
        <ButtonGroup size="large">
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
    variant: 'outlined',
    size: 'small',
    children: (
      <>
        <Button>⟨</Button>
        <Button>1</Button>
        <Button variant="contained">2</Button>
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
      <ButtonGroup connected variant="outlined">
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
        <Button className="flex items-center justify-center" variant="contained">
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