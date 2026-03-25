/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      colors: {
        theme: {
          bg: '#0d0d0d',
          sidebar: '#111111',
          card: '#18181b',
          border: '#2a2a2a',
          hover: '#1f1f23',
          text: '#ffffff',
          textSecondary: '#9ca3af',
          accent: '#6366f1',
          accentHover: '#4f46e5',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.6), 0 4px 6px -4px rgb(0 0 0 / 0.6)',
        'glow': '0 0 15px -3px rgba(99, 102, 241, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      },
    },
  },
  plugins: [],
}
