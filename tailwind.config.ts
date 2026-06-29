import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Warm beige palette
        beige: {
          50: '#FAF9F7',
          100: '#F5F3EF',
          200: '#F2EFEA',
          300: '#E8E4DC',
          400: '#D4CFC3',
        },
        stone: {
          50: '#FAF9F7',
          100: '#F5F3EF',
          200: '#E8E4DC',
          300: '#D4CFC3',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#2C2824',
          850: '#26221E',
          900: '#1C1917',
          950: '#0C0A09',
        },
        orange: {
          50: '#FEF3E2',
          100: '#FDEBD0',
          200: '#F8C471',
          300: '#F39C12',
          400: '#E67E22',
          500: '#D35400',
          600: '#A04000',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
