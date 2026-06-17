/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a0a',
          lighter: '#1a1a1a',
          card: '#121212',
        },
        accent: {
          DEFAULT: '#3b82f6', // Elegant blue
          hover: '#2563eb',
        }
      }
    },
  },
  plugins: [],
}
