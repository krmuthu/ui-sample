import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Typography, TypographyVariant } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Typography>;

// Basic usage
export const Basic: Story = {
  args: {
    children: 'This is a text using the default Body1 style',
  },
};

// Display variants
export const DisplayVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="display1">Display 1</Typography>
      <Typography variant="display2">Display 2</Typography>
    </div>
  ),
};

// Headline variants
export const HeadlineVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="headline1">Headline 1</Typography>
      <Typography variant="headline2">Headline 2</Typography>
      <Typography variant="headline3">Headline 3</Typography>
    </div>
  ),
};

// Title variants
export const TitleVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="title1">Title 1</Typography>
      <Typography variant="title2">Title 2</Typography>
      <Typography variant="title3">Title 3</Typography>
    </div>
  ),
};

// Body variants
export const BodyVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="body1">
        Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.
        Nullam id dolor id nibh ultricies vehicula ut id elit.
      </Typography>
      <Typography variant="body2">
        Body 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.
        Nullam id dolor id nibh ultricies vehicula ut id elit.
      </Typography>
    </div>
  ),
};

// Label variants
export const LabelVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="label1">Label 1</Typography>
      <Typography variant="label2">Label 2</Typography>
    </div>
  ),
};

// Font weights
export const FontWeights: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography weight="regular">Regular weight</Typography>
      <Typography weight="medium">Medium weight</Typography>
      <Typography weight="semibold">Semibold weight</Typography>
      <Typography weight="bold">Bold weight</Typography>
    </div>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography color="default">Default color</Typography>
      <Typography color="primary">Primary color</Typography>
      <Typography color="secondary">Secondary color</Typography>
      <Typography color="error">Error color</Typography>
      <Typography color="success">Success color</Typography>
      <Typography color="warning">Warning color</Typography>
      <Typography color="info">Info color</Typography>
      <Typography color="subtle">Subtle color</Typography>
    </div>
  ),
};

// Alignment
export const Alignment: Story = {
  render: () => (
    <div className="space-y-4 max-w-md border p-4">
      <Typography align="left">Left aligned text</Typography>
      <Typography align="center">Center aligned text</Typography>
      <Typography align="right">Right aligned text</Typography>
    </div>
  ),
};

// Truncated text
export const Truncated: Story = {
  render: () => (
    <div className="max-w-xs">
      <Typography truncate>
        This is a very long text that will be truncated with an ellipsis when it overflows the container.
        The truncation happens because we&apos;ve set the truncate prop to true.
      </Typography>
    </div>
  ),
};

// Custom element
export const CustomElement: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="headline1" as="div">
        This is a headline rendered as a div
      </Typography>
      <Typography variant="body1" as="span">
        This is body text rendered as a span
      </Typography>
    </div>
  ),
};

// All variants overview
export const AllVariants: Story = {
  render: () => {
    const variants: TypographyVariant[] = [
      'display1', 'display2',
      'headline1', 'headline2', 'headline3',
      'title1', 'title2', 'title3',
      'body1', 'body2',
      'label1', 'label2'
    ];
    
    return (
      <div className="space-y-6">
        <Typography variant="headline2" color="primary">Typography System</Typography>
        <div className="space-y-4">
          {variants.map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <div className="w-24">
                <Typography variant="label1" color="subtle">{variant}</Typography>
              </div>
              <Typography variant={variant}>
                The quick brown fox jumps over the lazy dog
              </Typography>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// Typography in a realistic layout
export const RealisticExample: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <Typography variant="display2" color="primary">
        Building Better User Interfaces
      </Typography>
      
      <Typography variant="headline3" color="subtle">
        A comprehensive guide to modern UI development
      </Typography>
      
      <div className="space-y-4">
        <Typography variant="title1">Introduction</Typography>
        
        <Typography variant="body1">
          Creating intuitive and beautiful user interfaces is a combination of good design principles,
          understanding of user behavior, and technical knowledge. In this guide, we&apos;ll explore the
          fundamentals of UI development and how to create interfaces that users love.
        </Typography>
        
        <Typography variant="body1">
          From typography to layout, from color theory to accessibility, we&apos;ll cover all aspects of
          modern UI development with practical examples and best practices.
        </Typography>
      </div>
      
      <div className="space-y-4">
        <Typography variant="title1">Typography Matters</Typography>
        
        <Typography variant="body1">
          Typography is the foundation of good UI design. It affects readability, visual hierarchy,
          and the overall aesthetic of your interface. Choosing the right typefaces, sizes, and styles
          can dramatically improve your UI.
        </Typography>
        
        <div className="pl-4 border-l-4 border-blue-200 space-y-2">
          <Typography variant="title3" color="primary">Pro Tip</Typography>
          <Typography variant="body2">
            Limit the number of typefaces in your design to 2-3 maximum. Use weight, size, and style
            variations within those typefaces to create hierarchy.
          </Typography>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Typography variant="title2">Key Benefits</Typography>
          <ul className="list-disc pl-5">
            <li>
              <Typography as="span" variant="body2">Better readability</Typography>
            </li>
            <li>
              <Typography as="span" variant="body2">Clearer visual hierarchy</Typography>
            </li>
            <li>
              <Typography as="span" variant="body2">Improved brand recognition</Typography>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <Typography variant="title2">Common Pitfalls</Typography>
          <ul className="list-disc pl-5">
            <li>
              <Typography as="span" variant="body2">Too many typefaces</Typography>
            </li>
            <li>
              <Typography as="span" variant="body2">Poor contrast and readability</Typography>
            </li>
            <li>
              <Typography as="span" variant="body2">Inconsistent styling</Typography>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <Typography variant="label1" color="subtle">Note</Typography>
        <Typography variant="body2">
          This is just the beginning of our series on UI development. Stay tuned for more articles
          on layout systems, color theory, and component design.
        </Typography>
      </div>
    </div>
  ),
}; 