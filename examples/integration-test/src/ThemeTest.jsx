import React from 'react';
import { Button, ButtonGroup, ThemeToggle, useTheme } from 'clipper-ui';

/**
 * Component to test theme toggling functionality
 */
function ThemeTest() {
  const { theme } = useTheme();

  // Helper component to demonstrate theming of a UI element
  const ThemeBlock = ({ name, className, children }) => (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">{name}</h3>
      <div className={`p-4 rounded-lg ${className}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 flex justify-between items-center">
        <span>Theme Integration Test</span>
        <ThemeToggle variant="icon" />
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Current Theme</h3>
        <div className="p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
          <code className="font-mono text-sm">{theme}</code>
        </div>
      </div>

      <ThemeBlock 
        name="UI Elements in Current Theme" 
        className="bg-[var(--background)] text-[var(--foreground)]"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
          </div>
          
          <ButtonGroup variant="primary" connected>
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>
          
          <p className="text-[var(--foreground)]">
            This text uses CSS variables to adapt to the current theme.
          </p>
        </div>
      </ThemeBlock>

      <ThemeBlock
        name="Theme Properties"
        className="bg-neutral-100 dark:bg-neutral-700"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Background</h4>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--background)] border border-neutral-300"></div>
              <code className="font-mono text-xs">var(--background)</code>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Foreground</h4>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--foreground)] border border-neutral-300"></div>
              <code className="font-mono text-xs">var(--foreground)</code>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Primary Button</h4>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--btn-primary-bg)] border border-neutral-300"></div>
              <code className="font-mono text-xs">var(--btn-primary-bg)</code>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Secondary Button</h4>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--btn-secondary-bg)] border border-neutral-300"></div>
              <code className="font-mono text-xs">var(--btn-secondary-bg)</code>
            </div>
          </div>
        </div>
      </ThemeBlock>

      <ThemeBlock
        name="Theme Toggle Controls"
        className="bg-neutral-100 dark:bg-neutral-700"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Button Variant</h4>
            <ThemeToggle />
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Icon Variant</h4>
            <ThemeToggle variant="icon" />
          </div>
        </div>
      </ThemeBlock>
    </div>
  );
}

export default ThemeTest; 