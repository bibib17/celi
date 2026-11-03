/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        choc: {
          dark: '#2B1713',
          milk: '#5C3D2E',
          caramel: '#93664C',
          light: '#F5ECE5',
        },
        berry: {
          soft: '#FFF0F3',
          blush: '#F8BBD0',
          punch: '#E75480',
        },
        cream: {
          card: '#FFFAF6',
        }
      },
      borderRadius: {
        'dock': '32px',
        'pill': '9999px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

