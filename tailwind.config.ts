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
        cream:   '#FFF8EF',
        sage:    '#7CA982',
        forest:  '#234236',
        coral:   '#F58A7A',
        sky:     '#8FBFE0',
        sand:    '#F3E8DA',
        taupe:   '#8B8178',
        charcoal:'#222222',
        success: '#4F9D69',
        amber:   '#F4B860',
        danger:  '#D9534F',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        sm:  '8px',
        md:  '12px',
        lg:  '18px',
        xl:  '24px',
        '2xl': '32px',
      },
      boxShadow: {
        card:       '0 8px 24px rgba(35, 66, 54, 0.08)',
        'card-lg':  '0 12px 32px rgba(35, 66, 54, 0.12)',
      },
      fontSize: {
        xs:   ['12px', { lineHeight: '1.5' }],
        sm:   ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg:   ['18px', { lineHeight: '1.5' }],
        xl:   ['22px', { lineHeight: '1.4' }],
        '2xl':['28px', { lineHeight: '1.3' }],
        '3xl':['36px', { lineHeight: '1.2' }],
      },
      spacing: {
        xs:  '4px',
        sm:  '8px',
        md:  '16px',
        lg:  '24px',
        xl:  '32px',
        '2xl':'48px',
      },
    },
  },
  plugins: [],
}

export default config
