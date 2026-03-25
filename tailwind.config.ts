import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAFAF8',
          dark: '#F0EDE8',
        },
        gold: {
          50:  '#FDF8EE',
          100: '#FAF0D7',
          200: '#F3DFA8',
          300: '#E5D4B0',
          400: '#C9A96E',
          500: '#B8923A',
          600: '#9A7520',
        },
        blush: {
          DEFAULT: '#F2D5C4',
          light: '#FAF0EB',
          dark: '#E8C0A8',
        },
        ink: {
          DEFAULT: '#2C2A27',
          light: '#4A4640',
        },
        stone: {
          400: '#B8AFA8',
          500: '#9A8F87',
          600: '#7A706A',
          700: '#5C524C',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer':  'shimmer 1.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
      },
      boxShadow: {
        soft: '0 2px 16px 0 rgba(44,42,39,0.06)',
        card: '0 4px 24px 0 rgba(44,42,39,0.10)',
        gold: '0 0 0 3px rgba(201,169,110,0.25)',
      },
      borderRadius: {
        xl:  '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}

export default config
