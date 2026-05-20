/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: { 900: '#0f0f13', 800: '#1a1a23', 700: '#252532', 600: '#2e2e3d' }
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'streak-fire': 'streak-fire 1s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: []
}
