/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: "#A8E6CF",
        pastelBlue: "#BDE0FE",
        softPink: "#FFC8DD",
        lavender: "#E4C1F9",
        dashboardBg: "#F8FAFC",
        cardBg: "#FFFFFF",
      },
    },
  },
  plugins: [],
}