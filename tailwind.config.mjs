/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

/** Brand kit: Brand/brand-kit.md */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        /** Spring Water Blue — links, buttons, primary accents */
        water: {
          50: '#eef5f8',
          100: '#d5e8ef',
          200: '#abd1e0',
          300: '#7ab3c9',
          400: '#4a94b0',
          500: '#2f7f9d',
          600: '#1F6F8B',
          700: '#185a70',
          800: '#134656',
          900: '#0f3845',
          DEFAULT: '#1F6F8B',
        },
        /** Deep Watershed Teal — headers, logo accents, section dividers */
        teal: {
          50: '#eef8f6',
          100: '#d4f0eb',
          200: '#a9e0d6',
          300: '#7dccbf',
          400: '#52b5a5',
          500: '#3ba393',
          600: '#2A9D8F',
          700: '#238176',
          800: '#1c675e',
          900: '#16524b',
          DEFAULT: '#2A9D8F',
        },
        /** Forest Green — section backgrounds, icons, ecological blocks */
        forest: {
          50: '#eef3f1',
          100: '#dce8e4',
          200: '#b8d1c9',
          300: '#8fb5a8',
          400: '#5f8f7f',
          500: '#457a68',
          600: '#366558',
          700: '#2F5D50',
          800: '#244740',
          900: '#1e3d35',
          950: '#162d28',
          DEFAULT: '#2F5D50',
        },
        /** Ozark Green — secondary accents */
        ozark: {
          50: '#f2f5ef',
          100: '#e0e8d9',
          200: '#c2d1b3',
          300: '#9fb587',
          400: '#729058',
          500: '#4C6B3C',
          600: '#425f34',
          700: '#364d2b',
          DEFAULT: '#4C6B3C',
        },
        /** Sandstone — cards, soft UI areas */
        sand: {
          50: '#f7f5f1',
          100: '#EFEDE8',
          200: '#D9D2C3',
          300: '#C9C0AE',
          DEFAULT: '#D9D2C3',
        },
        /** Stone Gray — borders, secondary text */
        stone: {
          50: '#f5f4f2',
          100: '#e8e6e2',
          200: '#d4d0c9',
          300: '#b8b2a8',
          400: '#a39c90',
          500: '#8C8579',
          600: '#756F65',
          700: '#5E5951',
          800: '#4A4640',
          900: '#3A3733',
          DEFAULT: '#8C8579',
        },
        /** Off White — main background */
        base: {
          50: '#F7F6F2',
          100: '#EFEDE8',
          DEFAULT: '#F7F6F2',
        },
        /** Legacy aliases — map to brand palette for existing utilities */
        spring: {
          50: '#eef5f8',
          100: '#d5e8ef',
          200: '#abd1e0',
          300: '#7ab3c9',
          400: '#4a94b0',
          500: '#2f7f9d',
          600: '#1F6F8B',
          700: '#185a70',
          800: '#134656',
          900: '#0f3845',
        },
        neutral: {
          50: '#F7F6F2',
          100: '#EFEDE8',
          200: '#E5E2DA',
          300: '#D9D2C3',
          400: '#B8B2A5',
          500: '#8C8579',
          600: '#756F65',
          700: '#5E5951',
          800: '#4A4640',
          900: '#3A3733',
          950: '#292723',
        },
        earth: {
          50: '#f7f5f1',
          100: '#EFEDE8',
          200: '#D9D2C3',
          300: '#C9C0AE',
          400: '#a39c90',
          500: '#8C8579',
          600: '#756F65',
          700: '#5E5951',
          800: '#4A4640',
          900: '#3A3733',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      borderRadius: {
        brand: '8px',
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        brand: '0 1px 2px 0 rgb(58 55 51 / 0.04)',
      },
    },
  },
  plugins: [typography],
};
