import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Basic: Story = {
  render: () => (
    <div className="p-16">
      <Popover
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Click me
          </button>
        }
      >
        <p>This is a basic popover with some content.</p>
      </Popover>
    </div>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <div className="p-16">
      <Popover
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            With Title
          </button>
        }
        title="Popover Title"
      >
        <p>This popover has a title in the header section.</p>
      </Popover>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-16">
      <Popover
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Top
          </button>
        }
        placement="top"
        title="Top Placement"
      >
        <p>This popover appears above the button</p>
      </Popover>
      <Popover
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Bottom
          </button>
        }
        placement="bottom"
        title="Bottom Placement"
      >
        <p>This popover appears below the button</p>
      </Popover>
      <Popover
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Left
          </button>
        }
        placement="left"
        title="Left Placement"
      >
        <p>This popover appears to the left of the button</p>
      </Popover>
      <Popover
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Right
          </button>
        }
        placement="right"
        title="Right Placement"
      >
        <p>This popover appears to the right of the button</p>
      </Popover>
    </div>
  ),
};

export const WithRichContent: Story = {
  render: () => (
    <div className="p-16">
      <Popover
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Rich Content
          </button>
        }
        title="User Profile"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
          <div>
            <h4 className="font-medium">John Doe</h4>
            <p className="text-sm text-gray-600">Software Engineer</p>
            <div className="mt-2">
              <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  ),
};

export const WithoutArrow: Story = {
  render: () => (
    <div className="p-16">
      <Popover
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            No Arrow
          </button>
        }
        arrow={false}
        title="No Arrow"
      >
        <p>This popover is displayed without an arrow pointing to the trigger.</p>
      </Popover>
    </div>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <div className="p-16">
      <Popover
        trigger={
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Custom Style
          </button>
        }
        className="bg-purple-50 border-purple-200"
        title={<span className="text-purple-700">Custom Styled Popover</span>}
      >
        <p className="text-purple-600">
          This popover has custom styles applied to match the trigger button.
        </p>
      </Popover>
    </div>
  ),
}; 