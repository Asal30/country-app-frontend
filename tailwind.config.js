/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#064e3b", // was 900
          200: "#065f46", // was 800
          300: "#047857", // was 700
          400: "#059669", // was 600
          500: "#10b981", // was 500 (middle stays the same)
          600: "#34d399", // was 400
          700: "#6ee7b7", // was 300
          800: "#a7f3d0", // was 200
          900: "#d1fae5", // was 100
        }        
      },
    },
  },
  plugins: [],
}