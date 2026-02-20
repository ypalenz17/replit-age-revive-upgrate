/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./client/index.html', './client/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ar-navy': '#212535',
        'ar-paper': '#F5F3EE',
        'ar-teal': '#19B3A6',
        'ar-violet': '#6C5CE7',
        'ar-ink': '#0B0D13',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Manrope', 'ui-sans-serif', 'system-ui'],
        serif: ['Fraunces', 'ui-serif', 'Georgia'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      borderRadius: {
        'ar-2xl': '2rem',
        'ar-3xl': '2.5rem',
        'ar-4xl': '3rem',
      },
      boxShadow: {
        soft: '0 18px 55px -35px rgba(11, 13, 19, 0.40)',
        float: '0 30px 90px -55px rgba(11, 13, 19, 0.55)',
      },
      keyframes: {
        'pulse-dot': { '0%, 100%': { opacity: '0.35' }, '50%': { opacity: '1' } },
        'scan-x': { '0%': { transform: 'translateX(-120%)' }, '100%': { transform: 'translateX(120%)' } },
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.3s ease-in-out infinite',
        'scan-x': 'scan-x 2.8s linear infinite',
      },
    },
  },
  plugins: [],
};
