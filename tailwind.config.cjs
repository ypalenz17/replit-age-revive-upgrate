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
        'ar-blue': '#1e3a8a',
        'ar-ink': '#0B0D13',
      },
      fontFamily: {
        head: ['FPHeadPro', 'Inter', 'ui-sans-serif', 'system-ui'],
        sans: ['"DM Sans"', 'Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      fontSize: {
        'ar-label': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.2em', fontWeight: '500' }],
        'ar-nav': ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '500' }],
      },
      borderRadius: {
        'ar-sm': '0.375rem',
        'ar-md': '0.5rem',
        'ar-lg': '0.75rem',
        'ar-xl': '1rem',
        'ar-2xl': '1.25rem',
        'ar-3xl': '1.5rem',
        'ar-4xl': '2rem',
      },
      boxShadow: {
        soft: '0 18px 55px -35px rgba(11, 13, 19, 0.40)',
        float: '0 30px 90px -55px rgba(11, 13, 19, 0.55)',
        'glow-teal': '0 0 40px rgba(25, 179, 166, 0.15), 0 0 80px rgba(25, 179, 166, 0.05)',
        'glow-violet': '0 0 40px rgba(108, 92, 231, 0.15), 0 0 80px rgba(108, 92, 231, 0.05)',
        'glow-purple': '0 0 40px rgba(139, 92, 246, 0.15), 0 0 80px rgba(139, 92, 246, 0.05)',
        'card-edge': 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
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
