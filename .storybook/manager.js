import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

// Create a theme with custom branding
const clipperTheme = create({
  base: 'light',
  
  // Brand configuration
  brandTitle: 'Clipper UI',
  brandUrl: './',
  brandTarget: '_self',
  brandImage: './clipper-icon-small.svg', // Use our optimized small SVG logo
  
  // UI colors
  colorPrimary: '#029CFD',   // Primary color (ocean blue)
  colorSecondary: '#FF4785', // Secondary color (coral)
  
  // UI configuration
  appBg: '#F6F9FC',
  appContentBg: '#FFFFFF',
  appBorderColor: 'rgba(0,0,0,.1)',
  appBorderRadius: 4,
  
  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',
});

// Apply the theme
addons.setConfig({
  theme: clipperTheme,
}); 