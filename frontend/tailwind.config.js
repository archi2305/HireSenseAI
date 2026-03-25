/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "rgb(var(--bg-color-rgb) / <alpha-value>)",
          surface: "rgb(var(--surface-color-rgb) / <alpha-value>)",
          sidebar: "rgb(var(--sidebar-color-rgb) / <alpha-value>)",
          border: "rgb(var(--border-color-rgb) / <alpha-value>)",
          text: "rgb(var(--text-color-rgb) / <alpha-value>)",
          textSecondary: "rgb(var(--text-secondary-rgb) / <alpha-value>)",
          accent: "rgb(var(--accent-color-rgb) / <alpha-value>)",
          accentHover: "rgb(var(--accent-hover-rgb) / <alpha-value>)",
          hover: "rgb(var(--hover-color-rgb) / <alpha-value>)",
          glow: "rgb(var(--accent-glow-rgb) / <alpha-value>)",
        },
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'linear': '0 1px 2px rgba(0,0,0,0.1)',
        'linear-lg': '0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -2px rgba(0,0,0,0.2)',
        'accent-glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'premium': '0 20px 50px rgba(0, 0, 0, 0.5)',
        'float': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-bottom': 'slideInBottom 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'floating 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        floating: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
