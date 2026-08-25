/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyan: { DEFAULT: '#22D3EE', 400: '#22D3EE', 500: '#06B6D4' },
        navy: { 950: '#030712', 900: '#0F172A', 800: '#1E293B' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite'
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } }
      }
    }
  },
  plugins: []
}
