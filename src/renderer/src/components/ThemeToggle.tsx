import { Theme, useAppStore } from '../store/useAppStore'

const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<Theme, string> = {
  system: '테마: 시스템 설정',
  light: '테마: 라이트',
  dark: '테마: 다크'
}

function Icon({ theme }: { theme: Theme }): React.JSX.Element {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  }
  if (theme === 'light') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    )
  }
  if (theme === 'dark') {
    return (
      <svg {...common}>
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
    </svg>
  )
}

function ThemeToggle({ className = '' }: { className?: string }): React.JSX.Element {
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)

  return (
    <button
      onClick={() => setTheme(NEXT[theme])}
      title={LABEL[theme]}
      aria-label={LABEL[theme]}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-cream-300 bg-surface text-ink-soft shadow-card transition hover:text-clay-dark ${className}`}
    >
      <Icon theme={theme} />
    </button>
  )
}

export default ThemeToggle
