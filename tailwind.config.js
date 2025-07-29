/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#22543d', // A deep, earthy green
          light: '#c6f6d5',
          dark: '#1a4731',
        },
        secondary: {
          DEFAULT: '#a0522d', // A warm, friendly brown
          light: '#f6e0c6',
        },
        accent: '#f6ad55', // A touch of orange/yellow for highlights
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: 0, transform: 'translateY(10px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
        toastIn: {
          'from': { transform: 'translateY(100%)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 },
        },
        toastOut: {
          'from': { transform: 'translateY(0)', opacity: 1 },
          'to': { transform: 'translateY(100%)', opacity: 0 },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'toast-enter': 'toastIn 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards',
        'toast-exit': 'toastOut 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards',
      },
    },
  },
  plugins: [],
}