/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Near-black product-grade dark palette.
        base: '#09090B', // page
        hero: '#C4B5FD', // flat lavender hero block
        'hero-ink': '#15122B', // text on the lavender hero
        surface: '#0E0E11', // nav, modal panel
        card: { DEFAULT: '#131316', hover: '#17171B' }, // cards
        elevated: { DEFAULT: '#1A1A1F', hover: '#212127' }, // chips / tiles on cards
        line: { DEFAULT: '#26262B', strong: '#383840' }, // hairline borders
        accent: {
          DEFAULT: '#C4B5FD', // lavender
          blue: '#4F9DFF',
          cyan: '#22D3EE',
        },
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(52,211,153,0.5)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 0 6px rgba(52,211,153,0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
