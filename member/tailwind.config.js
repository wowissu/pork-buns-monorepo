/* eslint-env node */

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0097de',
          100: '#E5F1F7',
          200: '#BDDEEC',
          300: '#91CBE5',
          400: '#64B9E0',
          500: '#33A8DE',
          600: '#0187C8',
          700: '#0278B2',
          800: '#03689D',
          900: '#035A87',
          1000: '#044B72'
        },
        negative: 'var(--q-negative)',
        positive: 'var(--q-positive)',
      }
    },
    screens: {
      'xs': '600px',
      // => @media (min-width: 640px) { ... }

      'sm': '1024px',
      // => @media (min-width: 768px) { ... }

      'md': '1450px',
      // => @media (min-width: 1024px) { ... }

      'lg': '1920px',
      // => @media (min-width: 1280px) { ... }
    }
  },
  plugins: [],
}
