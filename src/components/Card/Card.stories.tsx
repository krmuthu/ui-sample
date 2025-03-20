import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: () => (
    <Card title="Basic Card">
      <p>This is a basic card with a title and content.</p>
    </Card>
  ),
};

export const WithSubtitle: Story = {
  render: () => (
    <Card
      title="Card with Subtitle"
      subtitle="This is a subtitle that provides additional context."
    >
      <p>This card has both a title and subtitle.</p>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card
      title="Card with Footer"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      }
    >
      <p>This card has a footer with action buttons.</p>
    </Card>
  ),
};

export const Loading: Story = {
  render: () => (
    <Card title="Loading Card" isLoading={true}>
      <p>This card is in a loading state.</p>
    </Card>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <Card title="Hoverable Card" hoverable={true}>
      <p>Hover over this card to see the shadow effect.</p>
    </Card>
  ),
};

export const WithoutBorder: Story = {
  render: () => (
    <Card title="Borderless Card" bordered={false}>
      <p>This card has no border.</p>
    </Card>
  ),
};

export const WithoutPadding: Story = {
  render: () => (
    <Card title="Unpadded Card" padded={false}>
      <p>This card has no padding in its body.</p>
    </Card>
  ),
};

export const WithRichContent: Story = {
  render: () => (
    <Card
      title="Rich Content Card"
      subtitle="A card with various content types"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div>
            <h4 className="font-medium">John Doe</h4>
            <p className="text-sm text-gray-600">Software Engineer</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h5 className="font-medium mb-2">Profile Information</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p>john.doe@example.com</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Location</label>
              <p>San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <Card
      title="Custom Styled Card"
      className="bg-gray-50"
      headerClassName="bg-gray-100"
      bodyClassName="bg-white"
      footerClassName="bg-gray-100"
    >
      <p>This card has custom background colors for each section.</p>
      <div className="mt-4">
        <Button>Action</Button>
      </div>
    </Card>
  ),
}; 