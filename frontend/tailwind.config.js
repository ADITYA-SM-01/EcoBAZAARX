/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#F3FAF7',
          100: '#DEF7EC',
          200: '#BCF0DA',
          300: '#84E1BC',
          400: '#31C48D',
          500: '#0E9F6E',
          600: '#057A55',
          700: '#046C4E',
          800: '#03543F',
          900: '#014737',
        },
        nature: {
          50: '#F8FAF9',
          100: '#E6F4EA',
          200: '#CEEAD6',
          300: '#A8DAB5',
          400: '#6ABB8A',
          500: '#34A853',
          600: '#2D8745',
          700: '#266B38',
          800: '#1E4F2B',
          900: '#173F22',
        },
        earth: {
          50: '#FCF9F5',
          100: '#FAF3E8',
          200: '#F5E6D3',
          300: '#EFD3B2',
          400: '#E4B07C',
          500: '#D49054',
          600: '#B8773D',
          700: '#956132',
          800: '#724B26',
          900: '#5C3D1F',
        },
        sky: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B9DEFF',
          300: '#8AC7FF',
          400: '#59A9FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        carbon: {
          50: '#FDF2F2',
          100: '#FCE4E4',
          200: '#FBD0D0',
          300: '#F8A7A7',
          400: '#F05252',
          500: '#E02424',
          600: '#C81E1E',
          700: '#9B1C1C',
          800: '#771D1D',
          900: '#5E1919',
        },
        sunrise: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-custom': 'bounce-custom 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'confetti': 'confetti 5s ease-out forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #22c55e, 0 0 10px #22c55e, 0 0 15px #22c55e' },
          '100%': { boxShadow: '0 0 10px #22c55e, 0 0 20px #22c55e, 0 0 30px #22c55e' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'bounce-custom': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25px)' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'confetti': {
          '0%': { transform: 'translateY(0) rotate(0)', opacity: '1' },
          '100%': { transform: 'translateY(1000px) rotate(720deg)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}

