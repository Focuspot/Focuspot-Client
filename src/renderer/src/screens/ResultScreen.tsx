import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStreak, todayKey, useAppStore } from '../store/useAppStore'
import DraggableLayout from '../components/DraggableLayout'
import ExitButton from '../components/ExitButton'
import { formatTime, getCharacterImage } from '../characters'

function getMessage(seconds: number): string {
  if (seconds >= 3600 * 2) return '오늘 화분이 활짝 피었어요 🌸'
  if (seconds >= 3600) return '쑥쑥 자랐어요! 대단해요 🌿'
  if (seconds >= 60 * 25) return '새싹이 돋았어요 🌱'
  return '작은 한 걸음도 소중해요 🌱'
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}시간 ${m}분`
  if (m > 0) return `${m}분`
  return `${seconds}초`
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function getLastWeek(dailySeconds: Record<string, number>): { label: string; seconds: number }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      label: i === 6 ? '오늘' : WEEKDAYS[d.getDay()],
      seconds: dailySeconds[todayKey(d)] ?? 0
    }
  })
}

function ResultScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const nickname = useAppStore((state) => state.nickname)
  const character = useAppStore((state) => state.character)
  const customImage = useAppStore((state) => state.customImage)
  const totalSeconds = useAppStore((state) => state.totalSeconds)
  const dailySeconds = useAppStore((state) => state.dailySeconds)

  const todaySeconds = dailySeconds[todayKey()] ?? 0
  const streak = getStreak(dailySeconds)
  const week = getLastWeek(dailySeconds)
  const weekMax = Math.max(...week.map((d) => d.seconds), 1)

  const characterImage = getCharacterImage(character, customImage)

  useEffect(() => {
    window.electron.ipcRenderer.send('resize-result')
  }, [])

  return (
    <DraggableLayout className="px-7 pb-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="mb-14 rounded-full bg-sage-light px-3 py-1 text-xs font-semibold text-sage-dark">
          오늘의 집중 결과
        </p>

        <div className="w-full rounded-[28px] bg-surface px-6 pb-7 pt-10 text-center shadow-card">
          <div className="relative mx-auto -mt-20 mb-4 h-24 w-24">
            <img
              src={characterImage}
              alt="character"
              className="h-24 w-24 rounded-full object-cover shadow-float ring-4 ring-surface"
              draggable={false}
            />
          </div>
          <p className="text-base font-bold">{nickname || '집중러'}</p>
          <p className="mt-4 text-xs font-medium text-ink-muted">이번 집중</p>
          <p className="mt-1 font-mono text-[40px] font-bold leading-none tracking-tight text-clay-dark">
            {formatTime(totalSeconds)}
          </p>
          <p className="mt-3 text-[13px] text-ink-soft">{getMessage(todaySeconds)}</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-cream-100 py-2.5">
              <p className="text-[11px] text-ink-muted">오늘 총</p>
              <p className="text-sm font-bold">{formatDuration(todaySeconds)}</p>
            </div>
            <div className="rounded-2xl bg-cream-100 py-2.5">
              <p className="text-[11px] text-ink-muted">연속 집중</p>
              <p className="text-sm font-bold">{streak}일째 🔥</p>
            </div>
          </div>

          <div className="mt-4 flex h-16 items-end justify-between gap-1.5 px-1">
            {week.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  title={formatDuration(d.seconds)}
                  className={`w-full rounded-md ${i === 6 ? 'bg-clay' : 'bg-sage/60'}`}
                  style={{ height: `${Math.max(4, (d.seconds / weekMax) * 40)}px` }}
                />
                <span
                  className={`text-[10px] ${i === 6 ? 'font-bold text-clay-dark' : 'text-ink-muted'}`}
                >
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button onClick={() => navigate('/overlay')} className="btn-primary">
          한 번 더 집중하기
        </button>
        <button onClick={() => navigate('/')} className="btn-secondary">
          처음으로
        </button>
        <ExitButton />
      </div>
    </DraggableLayout>
  )
}

export default ResultScreen
