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
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
    },
  },
  plugins: [],
}
