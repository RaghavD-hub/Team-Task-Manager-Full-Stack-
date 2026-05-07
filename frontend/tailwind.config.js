/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F5F3EE',
          sidebar: '#1A1A18',
          accent: '#D4FF57',
          cardBg: '#E8E4DC',
          textMuted: '#8C8880',
          border: '#D9D5CC',
        },
        status: {
          todo: '#C9C5BC',
          inprogress: '#F5C842',
          done: '#2ECC71',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
