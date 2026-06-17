/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#E8F3FF',
          100: '#BEDAFF',
          200: '#94BFFF',
          300: '#6AA3FF',
          400: '#4080FF',
          500: '#165DFF',
          600: '#0E42D2',
          700: '#0A2BA6',
          800: '#061B79',
          900: '#03104D',
        },
        success: {
          50: '#E8FFEA',
          100: '#B1FFB8',
          200: '#7AF286',
          300: '#43D954',
          400: '#14C228',
          500: '#00B42A',
          600: '#009A29',
          700: '#007D27',
          800: '#006023',
          900: '#004A1E',
        },
        warning: {
          50: '#FFF7E8',
          100: '#FFE7BA',
          200: '#FFD58A',
          300: '#FFC157',
          400: '#FFAA24',
          500: '#FF7D00',
          600: '#DB6400',
          700: '#B74D00',
          800: '#933900',
          900: '#7A2B00',
        },
        danger: {
          50: '#FFECE8',
          100: '#FDCDC5',
          200: '#FBAAA0',
          300: '#F7847A',
          400: '#F53F3F',
          500: '#F53F3F',
          600: '#CB2634',
          700: '#A1182C',
          800: '#770D24',
          900: '#59081E',
        },
        neutral: {
          50: '#F7F8FA',
          100: '#E5E6EB',
          200: '#C9CDD4',
          300: '#86909C',
          400: '#4E5969',
          500: '#272E3B',
          600: '#1D2129',
          700: '#0F1218',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
