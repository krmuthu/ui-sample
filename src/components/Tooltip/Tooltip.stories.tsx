import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  render: () => (
    <div className="p-16">
      <Tooltip content="This is a basic tooltip">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Hover me
        </button>
      </Tooltip>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-16">
      <Tooltip content="Top tooltip" placement="top">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Top
        </button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Bottom
        </button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Left
        </button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Right
        </button>
      </Tooltip>
    </div>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <div className="p-16">
      <Tooltip
        content={
          <div className="text-center">
            <h3 className="font-bold mb-1">Custom Tooltip</h3>
            <p className="text-sm">This tooltip has custom HTML content</p>
            <hr className="my-2 border-gray-500" />
            <p className="text-xs">With multiple lines</p>
          </div>
        }
      >
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Hover for rich content
        </button>
      </Tooltip>
    </div>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <div className="flex gap-4 p-16">
      <Tooltip content="Quick tooltip" showDelay={0} hideDelay={0}>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          No delay
        </button>
      </Tooltip>
      <Tooltip content="Delayed tooltip" showDelay={1000} hideDelay={500}>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          With delay
        </button>
      </Tooltip>
    </div>
  ),
};

export const WithoutArrow: Story = {
  render: () => (
    <div className="p-16">
      <Tooltip content="Tooltip without arrow" arrow={false}>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          No arrow
        </button>
      </Tooltip>
    </div>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <div className="p-16">
      <Tooltip
        content="Custom styled tooltip"
        className="bg-purple-600 text-white font-bold"
      >
        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Custom style
        </button>
      </Tooltip>
    </div>
  ),
}; 