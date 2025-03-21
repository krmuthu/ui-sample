import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';
import { ThemeProvider } from '../src/components/ThemeProvider/ThemeProvider';
import { ThemeToggle } from '../src/components/ThemeToggle/ThemeToggle';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'dark',
          value: '#121212',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="p-4 bg-[var(--background)] transition-colors duration-200">
          <div className="mb-4 flex justify-end">
            <ThemeToggle variant="icon" />
          </div>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview; 