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
        gold: {
          50: '#fdfbf2',
          100: '#f9f5e0',
          200: '#f2e8b9',
          300: '#ebd88c',
          400: '#e1c255',
          500: '#d4af37', // primary gold
          600: '#b89228',
          700: '#926f1f',
          800: '#76581d',
          900: '#63491c',
        },
        dark: {
          900: '#0b0f17',
          800: '#111827',
          700: '#1a2234',
          600: '#26334d',
        },
        cream: {
          50: '#fffdfa',
          100: '#fbf8f1',
          200: '#f5efe0',
          300: '#ece1cb',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
