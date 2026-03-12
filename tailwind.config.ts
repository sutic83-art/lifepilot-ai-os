import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f172a',
          soft: '#e2e8f0',
          accent: '#2563eb'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
