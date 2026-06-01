/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        facebook: {
          blue: '#1877F2',
          dark: '#242526',
          darker: '#18191A',
          light: '#F0F2F5',
          gray: '#E4E6EB',
          text: '#050505',
          textDark: '#E4E6EB'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}