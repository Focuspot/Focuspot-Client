/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FFFBF5', 100: '#FFF4E6', 200: '#F6E7D3', 300: '#EBD6BC' },
        ink: { DEFAULT: '#2E241D', soft: '#6F5F52', muted: '#A8988A' },
        clay: { DEFAULT: '#F2784B', dark: '#E35F35', light: '#FFE3D6' },
        sage: { DEFAULT: '#6FAF7B', dark: '#4E9160', light: '#E3F1E4' }
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Apple SD Gothic Neo"',
          '"Segoe UI"',
          '"Malgun Gothic"',
          'sans-serif'
        ]
      },
      boxShadow: {
        card: '0 1px 2px rgba(46,36,29,0.05), 0 6px 18px rgba(46,36,29,0.06)',
        float: '0 2px 4px rgba(46,36,29,0.12), 0 8px 20px rgba(46,36,29,0.16)',
        'press-clay': '0 3px 0 #E35F35',
        'press-sage': '0 3px 0 #4E9160',
        'press-cream': '0 3px 0 #EBD6BC'
      },
      keyframes: {
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } }
      },
      animation: {
        bob: 'bob 3.2s ease-in-out infinite',
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
