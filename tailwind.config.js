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
        base: '#09090B',
        surface: '#0E0E11',
        card: '#131316',
        line: '#26262B',
        accent: {
          DEFAULT: '#7C5CFF', // violet
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
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
