import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const query = '(prefers-color-scheme: dark)'

/** 저장된 테마 설정(시스템/라이트/다크)을 <html class="dark"> 로 반영한다. */
export function useApplyTheme(): void {
  const theme = useAppStore((state) => state.theme)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent): void => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const dark = theme === 'dark' || (theme === 'system' && systemDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
}
