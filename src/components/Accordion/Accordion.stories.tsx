import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// Basic example with single expansion
export const Basic: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion>
        <Accordion.Item id="1" header="What is Clipper UI?">
          Clipper UI is a modern React component library built with TypeScript and Tailwind CSS,
          designed to provide a seamless development experience with beautiful, accessible components.
        </Accordion.Item>
        <Accordion.Item id="2" header="How do I install Clipper UI?">
          You can install Clipper UI using npm or yarn:
          <pre className="mt-2 bg-gray-100 p-2 rounded">
            npm install clipper-ui
          </pre>
        </Accordion.Item>
        <Accordion.Item id="3" header="Is Clipper UI accessible?">
          Yes! Clipper UI is built with accessibility in mind. All components follow WAI-ARIA guidelines
          and are thoroughly tested with screen readers and keyboard navigation.
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

// Multiple items can be expanded simultaneously
export const MultipleExpansion: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion allowMultiple defaultOpenItems={['1']}>
        <Accordion.Item id="1" header="First Section">
          This is the content of the first section. It can remain open while other sections are expanded.
        </Accordion.Item>
        <Accordion.Item id="2" header="Second Section">
          This is the content of the second section. Try expanding this while the first section is open!
        </Accordion.Item>
        <Accordion.Item id="3" header="Third Section">
          This is the content of the third section. All sections can be open at once.
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

// Example with disabled items
export const WithDisabledItems: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion>
        <Accordion.Item id="1" header="Available Section">
          This section can be expanded and collapsed.
        </Accordion.Item>
        <Accordion.Item id="2" header="Disabled Section" disabled>
          This section cannot be interacted with.
        </Accordion.Item>
        <Accordion.Item id="3" header="Another Available Section">
          This section is also interactive.
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

// Custom styled example
export const CustomStyled: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion className="bg-blue-50 border-blue-200">
        <Accordion.Item 
          id="1" 
          header={
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
              <span className="text-blue-700">Custom Header Style</span>
            </div>
          }
          className="hover:bg-blue-100"
        >
          <div className="prose">
            <p>This example shows how you can customize the appearance of the accordion.</p>
            <ul>
              <li>Custom header content</li>
              <li>Custom background colors</li>
              <li>Custom hover states</li>
            </ul>
          </div>
        </Accordion.Item>
        <Accordion.Item 
          id="2" 
          header={
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
              <span className="text-blue-700">Another Custom Section</span>
            </div>
          }
          className="hover:bg-blue-100"
        >
          The styling possibilities are endless when combining with Tailwind CSS.
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

// Nested accordions example
export const NestedAccordions: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion>
        <Accordion.Item id="1" header="Main Section 1">
          <p className="mb-4">This is the main content of section 1.</p>
          <Accordion>
            <Accordion.Item id="1.1" header="Nested Section 1">
              Content of nested section 1
            </Accordion.Item>
            <Accordion.Item id="1.2" header="Nested Section 2">
              Content of nested section 2
            </Accordion.Item>
          </Accordion>
        </Accordion.Item>
        <Accordion.Item id="2" header="Main Section 2">
          <p className="mb-4">This is the main content of section 2.</p>
          <Accordion>
            <Accordion.Item id="2.1" header="Nested Section 1">
              Content of nested section 1
            </Accordion.Item>
            <Accordion.Item id="2.2" header="Nested Section 2">
              Content of nested section 2
            </Accordion.Item>
          </Accordion>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
}; 