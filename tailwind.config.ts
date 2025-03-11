import type { Config } from "tailwindcss";
import fs from 'fs';
import path from 'path';

// Define more specific types for our design tokens that align with Tailwind's expectations
interface DesignTokens {
  colors?: Record<string, Record<string, string>>;
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  boxShadow?: Record<string, string>;
  fontSize?: Record<string, string | [string, string] | [string, Partial<{
    lineHeight: string;
    letterSpacing: string;
    fontWeight: string | number;
  }>]>;
  fontWeight?: Record<string, string>;
  lineHeight?: Record<string, string>;
  zIndex?: Record<string, string>;
}

// Import design tokens with proper error handling
let designTokens: DesignTokens = {};

// Path to the generated tokens file
const tokensPath = path.join(process.cwd(), 'src/styles/tailwind-theme-simple.mjs');

// Check if the file exists and load it if it does
if (fs.existsSync(tokensPath)) {
  try {
    // Dynamic import at runtime - we'll use a different approach for ESM
    import(tokensPath)
      .then(imported => {
        designTokens = imported.default;
      })
      .catch(() => {
        console.warn("Error loading design tokens. Run 'npm run tokens' to regenerate them.");
      });
  } catch {
    console.warn("Error loading design tokens. Run 'npm run tokens' to regenerate them.");
  }
} else {
  console.warn("Design tokens not found. Run 'npm run tokens' to generate them.");
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: designTokens.colors || {
        // Fallback colors if tokens haven't been generated yet
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        // Secondary colors from Figma
        secondary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Neutral colors from Figma
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        // Semantic colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
      },
      ...(designTokens.spacing ? { spacing: designTokens.spacing } : {}),
      ...(designTokens.borderRadius ? { borderRadius: designTokens.borderRadius } : {}),
      ...(designTokens.boxShadow ? { boxShadow: designTokens.boxShadow } : {}),
      ...(designTokens.fontSize ? { fontSize: designTokens.fontSize } : {}),
      ...(designTokens.fontWeight ? { fontWeight: designTokens.fontWeight } : {}),
      ...(designTokens.lineHeight ? { lineHeight: designTokens.lineHeight } : {}),
      ...(designTokens.zIndex ? { zIndex: designTokens.zIndex } : {}),
    },
  },
  plugins: [],
};

export default config;
