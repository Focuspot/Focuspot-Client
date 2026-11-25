/** CSS 변수(RGB 채널) → 투명도(/50 등) 지원 색상 */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 실제 값은 main.css 의 CSS 변수 (라이트/다크 테마별)
        surface: v('surface'),
        cream: { 50: v('cream-50'), 100: v('cream-100'), 200: v('cream-200'), 300: v('cream-300') },
        ink: { DEFAULT: v('ink'), soft: v('ink-soft'), muted: v('ink-muted') },
        clay: { DEFAULT: v('clay'), dark: v('clay-dark'), light: v('clay-light') },
        sage: { DEFAULT: v('sage'), dark: v('sage-dark'), light: v('sage-light') }
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
        card: '0 1px 2px rgb(var(--shadow) / 0.05), 0 6px 18px rgb(var(--shadow) / 0.06)',
        float: '0 2px 4px rgb(var(--shadow) / 0.12), 0 8px 20px rgb(var(--shadow) / 0.16)',
        'press-clay': '0 3px 0 #E35F35',
        'press-sage': '0 3px 0 #4E9160',
        'press-cream': '0 3px 0 rgb(var(--cream-300))'
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
