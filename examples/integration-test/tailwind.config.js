/** @type {import('tailwindcss').Config} */

// Import the theme directly from the component library
import { theme } from 'clipper-ui';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Include the component library components
    '../../src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'], // Support both class and data-theme attribute
  theme: {
    extend: {
      colors: theme.colors,
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
      fontSize: theme.fontSize,
    },
  },
  plugins: [],
}; 