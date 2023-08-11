/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'custom-white': {
          100: '#e5e7eb',
          200: '#a3a3a3'
        },
        'custom-yellow': {
          100: '#e9ce8b',
          200: '#f0c900'
        },
        'custom-purple': { 
          100: '#49249b', 
          200: '#362472',
          'text': '#bf94ff'
        },
        'custom-blue': {
          100: '#1b202b',
          200: '#1c2535',
          300: '#28344e',
          400: '#5383e8'
        },
        'custom-red': {
          300: '#59343b',
          400: '#e84057'
        }
      }
    },
  },
  plugins: [],
}
