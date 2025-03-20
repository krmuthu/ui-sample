import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

const defaultItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Smartphones', isActive: true },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const WithoutHomeIcon: Story = {
  args: {
    items: defaultItems,
    showHomeIcon: false,
  },
};

export const CustomSeparator: Story = {
  args: {
    items: defaultItems,
    separator: '>',
  },
};

export const CustomStyles: Story = {
  args: {
    items: defaultItems,
    className: 'bg-gray-100 p-4 rounded-lg',
    itemClassName: 'font-semibold',
    separatorClassName: 'text-gray-600',
  },
};

export const LongLabels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Smartphones', href: '/products/electronics/smartphones' },
      { label: 'Latest Models', href: '/products/electronics/smartphones/latest' },
      { label: 'Premium Collection', isActive: true },
    ],
  },
}; 