/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        mint: "#A8E6CF",
        pastelBlue: "#BDE0FE",
        softPink: "#FFC8DD",
        lavender: "#E4C1F9",
        dashboardBg: "#F8FAFC",
        cardBg: "#FFFFFF",
      },
      backgroundImage: {
        "dashboard-gradient": "linear-gradient(135deg, #eef2ff, #fdf2f8)",
        "pastel-gradient": "linear-gradient(135deg, #eef2ff, #fdf2f8)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
        "button-gradient": "linear-gradient(to right, #818CF8, #C084FC)",
        "hover-gradient": "linear-gradient(135deg, #E0E7FF, #FCE7F3)",
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'hover-glass': '0 12px 40px 0 rgba(31, 38, 135, 0.12)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'hover-card': '0 12px 40px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
