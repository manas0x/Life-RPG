/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#0a0a0f',
          800: '#14141e',
          700: '#1e1e2e',
          600: '#2a2a3e',
        },
        ember: {
          400: '#ffb86a',
          500: '#ff8c42',
          600: '#e76f51',
        },
        rune: {
          gold: '#d4a574',
          muted: '#8b7355'
        }
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255,140,66,0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(255,140,66,0.6)' }
        }
      }
    },
  },
  plugins: [],
}
