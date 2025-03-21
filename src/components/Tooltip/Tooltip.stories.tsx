import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
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
  args: {
    content: 'This is a tooltip',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    placement: 'top',
  },
};

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-10 place-items-center">
      <Tooltip content="Top placement" placement="top">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Top</button>
      </Tooltip>
      
      <Tooltip content="Right placement" placement="right">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Right</button>
      </Tooltip>
      
      <Tooltip content="Bottom placement" placement="bottom">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Bottom</button>
      </Tooltip>
      
      <Tooltip content="Left placement" placement="left">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Left</button>
      </Tooltip>
    </div>
  ),
};

export const CustomOffset: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-10">
      <Tooltip content="Default offset (8px)" placement="top">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Default Offset</button>
      </Tooltip>
      
      <Tooltip content="Small offset (4px)" placement="top" offset={4}>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Small Offset</button>
      </Tooltip>
      
      <Tooltip content="Large offset (16px)" placement="top" offset={16}>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Large Offset</button>
      </Tooltip>
      
      <Tooltip content="Very large offset (32px)" placement="top" offset={32}>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Very Large Offset</button>
      </Tooltip>
    </div>
  ),
};

export const NoArrow: Story = {
  args: {
    content: 'Tooltip without arrow',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">No Arrow</button>,
    arrow: false,
  },
};

export const CustomStyle: Story = {
  args: {
    content: 'Custom styled tooltip',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Custom Style</button>,
    className: 'bg-red-500 text-yellow-100 font-bold',
  },
}; 