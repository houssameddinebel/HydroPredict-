/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        oasis: {
          50: '#effaf5',
          100: '#d7f2e3',
          500: '#0e9f6e',
          600: '#057a55',
          700: '#046c4e'
        },
        sand: {
          50: '#fdf8ef',
          100: '#fbf0d9',
          500: '#e3a008'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Tahoma', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};
