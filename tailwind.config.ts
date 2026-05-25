import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50:  '#EBF5FF',
          100: '#D6EAFF',
          200: '#ADDAFF',
          300: '#80C5FF',
          400: '#4DAAFF',
          500: '#5B9BD5',
          600: '#3D7FBF',
          700: '#2E6399',
          800: '#1F4773',
          900: '#102C4D',
        },
        coral: {
          50:  '#FFF0ED',
          100: '#FFE0DA',
          200: '#FFC1B5',
          300: '#FF9F8F',
          400: '#F07B65',
          500: '#E8705A',
          600: '#D45A44',
          700: '#B54433',
          800: '#8F3228',
          900: '#6A201A',
        },
        cream: {
          50:  '#FFFDF9',
          100: '#FDF8F3',
          200: '#FAF0E4',
          300: '#F5E3CE',
          400: '#EDD3B5',
          500: '#E0C09A',
        },
        charcoal: {
          50:  '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#666666',
          600: '#4A4A4A',
          700: '#2E2E2E',
          800: '#1A1A1A',
          900: '#0D0D0D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}

export default config
