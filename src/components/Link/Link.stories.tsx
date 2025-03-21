import { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
    },
    href: { control: 'text' },
    target: {
      control: 'select',
      options: ['_blank', '_self', '_parent', '_top'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    href: 'https://example.com',
    children: 'Default Link',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    href: 'https://example.com',
    children: 'Primary Link',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    href: 'https://example.com',
    children: 'Secondary Link',
    variant: 'secondary',
  },
};

export const ExternalLink: Story = {
  args: {
    href: 'https://example.com',
    children: 'External Link',
    target: '_blank',
    variant: 'default',
  },
}; 