import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tag, TagColor, TagSize } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tag>;

// Basic usage
export const Basic: Story = {
  args: {
    text: 'Tag',
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag text="Filled" variant="filled" />
      <Tag text="Outlined" variant="outlined" />
      <Tag text="Soft" variant="soft" />
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag text="Small" size="sm" />
      <Tag text="Medium" size="md" />
      <Tag text="Large" size="lg" />
    </div>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Tag text="Primary" color="primary" />
        <Tag text="Secondary" color="secondary" />
        <Tag text="Success" color="success" />
        <Tag text="Danger" color="danger" />
        <Tag text="Warning" color="warning" />
        <Tag text="Info" color="info" />
        <Tag text="Neutral" color="neutral" />
      </div>
    </div>
  ),
};

// With Hash Prefix
export const WithHashPrefix: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag text="javascript" hasHashPrefix />
      <Tag text="react" color="primary" hasHashPrefix />
      <Tag text="typescript" color="info" hasHashPrefix />
      <Tag text="webdev" color="secondary" hasHashPrefix />
      <Tag text="programming" color="success" hasHashPrefix />
    </div>
  ),
};

// Tag as a Link
export const AsLink: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag 
        text="react" 
        color="primary" 
        hasHashPrefix 
        isLink 
        href="/tags/react"
        onClick={() => alert('Clicked on #react tag')}
      />
      <Tag 
        text="javascript" 
        color="warning" 
        hasHashPrefix 
        isLink 
        href="/tags/javascript"
      />
      <Tag 
        text="typescript" 
        color="info" 
        hasHashPrefix 
        isLink 
        href="/tags/typescript"
      />
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag 
        text="React" 
        color="primary"
        icon={
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9m-4.95-8.56l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04c-1.59-1.5-2.97-2.08-3.6-1.7-.63.35-.82 1.82-.31 3.96.77-.16 1.58-.28 2.4-.36.48-.67.99-1.31 1.51-1.9z" />
          </svg>
        }
      />
      <Tag 
        text="JavaScript" 
        color="warning"
        icon={
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z" />
          </svg>
        }
      />
      <Tag 
        text="TypeScript" 
        color="info"
        icon={
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h18v18H3V3m10.71 14.86c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8M13 11.25H8v1.5h1.5V20h1.75v-7.25H13v-1.5z" />
          </svg>
        }
      />
    </div>
  ),
};

// Removable Tags
export const RemovableTags: Story = {
  render: () => {
    const [tags, setTags] = React.useState([
      { id: 1, text: 'javascript', color: 'warning' as TagColor },
      { id: 2, text: 'react', color: 'primary' as TagColor },
      { id: 3, text: 'typescript', color: 'info' as TagColor },
      { id: 4, text: 'webdev', color: 'secondary' as TagColor },
    ]);
    
    const handleRemove = (id: number) => {
      setTags(tags.filter(tag => tag.id !== id));
    };
    
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Tag
            key={tag.id}
            text={tag.text}
            color={tag.color}
            hasHashPrefix
            removable
            onRemove={() => handleRemove(tag.id)}
          />
        ))}
        {tags.length === 0 && (
          <div className="text-gray-500">All tags have been removed</div>
        )}
      </div>
    );
  },
};

// Tag Cloud
export const TagCloud: Story = {
  render: () => {
    // Sample tag data with text and frequency
    const tagData = [
      { text: 'javascript', count: 142, color: 'warning' as TagColor },
      { text: 'react', count: 89, color: 'primary' as TagColor },
      { text: 'typescript', count: 56, color: 'info' as TagColor },
      { text: 'webdev', count: 120, color: 'secondary' as TagColor },
      { text: 'css', count: 76, color: 'danger' as TagColor },
      { text: 'html', count: 95, color: 'success' as TagColor },
      { text: 'programming', count: 152, color: 'neutral' as TagColor },
      { text: 'frontend', count: 68, color: 'primary' as TagColor },
      { text: 'backend', count: 42, color: 'info' as TagColor },
      { text: 'design', count: 35, color: 'secondary' as TagColor },
    ];
    
    // Calculate size based on frequency
    const getSize = (count: number): TagSize => {
      if (count > 100) return 'lg';
      if (count > 50) return 'md';
      return 'sm';
    };
    
    return (
      <div className="max-w-xl">
        <h3 className="text-lg font-medium mb-3">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tagData.map(tag => (
            <Tag
              key={tag.text}
              text={`${tag.text} (${tag.count})`}
              hasHashPrefix
              color={tag.color}
              size={getSize(tag.count)}
              isLink
              href={`/tags/${tag.text}`}
            />
          ))}
        </div>
      </div>
    );
  },
};

// Input with Tags
export const InputWithTags: Story = {
  render: () => {
    const [tags, setTags] = React.useState([
      { id: 1, text: 'javascript' },
      { id: 2, text: 'react' },
    ]);
    
    const [inputValue, setInputValue] = React.useState('');
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };
    
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim() !== '') {
        setTags([...tags, { id: Date.now(), text: inputValue.trim() }]);
        setInputValue('');
      }
    };
    
    const handleRemoveTag = (id: number) => {
      setTags(tags.filter(tag => tag.id !== id));
    };
    
    return (
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-2">
          {tags.map(tag => (
            <Tag
              key={tag.id}
              text={tag.text}
              hasHashPrefix
              size="sm"
              removable
              onRemove={() => handleRemoveTag(tag.id)}
            />
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="flex-grow min-w-[120px] border-none outline-none text-sm"
            placeholder="Add a tag..."
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Type a tag name and press Enter to add it
        </p>
      </div>
    );
  },
}; 