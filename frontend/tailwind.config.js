/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary — Azul escuro da logo (#0D1B3E → #1a2a5e)
        primary: {
          50:  '#e8edf7',
          100: '#c5d0ec',
          200: '#9eb0de',
          300: '#7290d0',
          400: '#4f77c6',
          500: '#2a5ebb',
          600: '#1a4aaa',
          700: '#153a93',
          800: '#0f2a7a',
          900: '#0D1B3E',
          950: '#080f24',
        },
        // Brand blue — Azul brilhante da logo (#1D6AFF / #00A3FF)
        brand: {
          50:  '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da8ff',
          400: '#1a8fff',
          500: '#1D6AFF',
          600: '#005ce6',
          700: '#004dcc',
          800: '#003db3',
          900: '#002e99',
        },
        // Accent — ciano brilhante da curva da logo
        accent: {
          400: '#00C8FF',
          500: '#00A3FF',
          600: '#0082e6',
        },
        // Neutrals — cinzentos puros sem tint azul
        neutral: {
          50:  '#FEFEFE',
          100: '#f5f5f5',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#333333',
          800: '#1e1e1e',
          900: '#111111',
          950: '#000000',
        },
        // Dark surfaces — hierarquia clara entre camadas
        dark: {
          bg:       '#141414',   /* fundo raiz */
          card:     '#1e1e1e',   /* cards / painéis */
          elevated: '#282828',   /* modais / dropdowns */
          hover:    '#282828',   /* hover state */
          border:   '#333333',   /* bordas e divisores */
          subtle:   '#3d3d3d',   /* bordas mais visíveis */
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(29,106,255,0.15)',
        modal: '0 20px 60px -10px rgba(0,0,0,0.4)',
        brand: '0 0 20px rgba(29,106,255,0.3)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.3)' } },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' }
        },
        shimmer: {
          '0%':   { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition:  '600px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
