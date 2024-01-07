/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '19.5px'],
      lg: ['18px', '21.94px'],
      xl: ['20px', '24.38px'],
      '2xl': ['24px', '29.26px'],
      '3xl': ['28px', '50px'],
      '4xl': ['48px', '58px'],
      '8xl': ['96px', '106px']
    },
    extend: {
      fontFamily: {
        iransans: ['IRANSans'],
      },
      colors: {
        'primary': 'var(--primary)',
        'secondary': "var(--secondary)",
        'hover': "rgba(0, 0, 0, 0.1)",
        'soft-hover': "rgba(0, 0, 0, 0.04)",
        "coral-red": "#FF6452",
        "slate-gray": "#6D6D6D",
        "pale-blue": "#F5F6FF",
        "white-400": "rgba(255, 255, 255, 0.80)",
        'secondary-text': '#9d9d9d',
        'primary-text': '#252525',
        'error': 'var(--error)',
        'borders': 'var(--border)',
        'darken-borders': 'var(--darken-border)',
      },
      boxShadow: {
        '3xl': '0 10px 40px rgba(0, 0, 0, 0.1)'
      },
      screens: {
        "wide": "1440px"
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shake: {
          '0%': { transform: ' translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '50%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)' }
        },
        gentleEnter: {
          '0%': { marginTop: ' -3%', opacity: 0.1, transform: 'scale(1.1)', },
          '25%': { marginTop: ' -2%', opacity: 0.4, transform: 'scale(1.07)', },
          '50%': { marginTop: ' -1%', opacity: 0.7, transform: 'scale(1.04)', },
          '100% ': { marginTop: ' 0%', opacity: 1, transform: 'scale(1)' }
        }
      },
      animation: {
        popIn: 'popIn 200ms ease-out forwards',
        fadeIn: 'fadeIn 200ms ease-out forwards',
        shake: 'shake 0.15s ease-in-out normal',
        gentleEnter: 'gentleEnter 0.2s ease-out alternate'
      }
    },
  },
  plugins: [],
}

