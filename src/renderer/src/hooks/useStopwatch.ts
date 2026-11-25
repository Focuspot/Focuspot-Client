import { useCallback, useEffect, useState } from 'react'

interface Stopwatch {
  seconds: number
  isRunning: boolean
  toggle: () => void
  pause: () => void
}

interface Clock {
  accumulatedMs: number // 일시정지 전까지 쌓인 시간
  startedAt: number | null // 실행 중이면 마지막으로 시작한 시각
}

/**
 * 시작 시각을 기준으로 경과 시간을 계산하는 스톱워치.
 * setInterval 로 1씩 더하는 방식과 달리 창이 가려져 타이머가 밀려도 시간이 틀어지지 않는다.
 */
export function useStopwatch(autoStart = true): Stopwatch {
  const [clock, setClock] = useState<Clock>(() => ({
    accumulatedMs: 0,
    startedAt: autoStart ? Date.now() : null
  }))
  const [now, setNow] = useState(() => Date.now())
  const isRunning = clock.startedAt !== null

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [isRunning])

  const pause = useCallback(() => {
    const t = Date.now()
    setClock((c) =>
      c.startedAt === null
        ? c
        : { accumulatedMs: c.accumulatedMs + (t - c.startedAt), startedAt: null }
    )
    setNow(t)
  }, [])

  const toggle = useCallback(() => {
    const t = Date.now()
    setClock((c) =>
      c.startedAt === null
        ? { ...c, startedAt: t }
        : { accumulatedMs: c.accumulatedMs + (t - c.startedAt), startedAt: null }
    )
    setNow(t)
  }, [])

  const elapsedMs =
    clock.accumulatedMs + (clock.startedAt !== null ? Math.max(0, now - clock.startedAt) : 0)

  return { seconds: Math.floor(elapsedMs / 1000), isRunning, toggle, pause }
}
