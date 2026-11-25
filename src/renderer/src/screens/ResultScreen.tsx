import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import DraggableLayout from '../components/DraggableLayout'
import ExitButton from '../components/ExitButton'
import { formatTime, getCharacterImage } from '../characters'

function getMessage(seconds: number): string {
  if (seconds >= 3600 * 2) return '오늘 화분이 활짝 피었어요 🌸'
  if (seconds >= 3600) return '쑥쑥 자랐어요! 대단해요 🌿'
  if (seconds >= 60 * 25) return '새싹이 돋았어요 🌱'
  return '작은 한 걸음도 소중해요 🌱'
}

function ResultScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const nickname = useAppStore((state) => state.nickname)
  const character = useAppStore((state) => state.character)
  const customImage = useAppStore((state) => state.customImage)
  const totalSeconds = useAppStore((state) => state.totalSeconds)

  const characterImage = getCharacterImage(character, customImage)

  useEffect(() => {
    window.electron.ipcRenderer.send('resize-result')
  }, [])

  return (
    <DraggableLayout className="px-7 pb-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="mb-16 rounded-full bg-sage-light px-3 py-1 text-xs font-semibold text-sage-dark">
          오늘의 집중 결과
        </p>

        <div className="w-full rounded-[28px] bg-white px-6 pb-7 pt-10 text-center shadow-card">
          <div className="relative mx-auto -mt-20 mb-4 h-24 w-24">
            <img
              src={characterImage}
              alt="character"
              className="h-24 w-24 rounded-full object-cover shadow-float ring-4 ring-white"
              draggable={false}
            />
          </div>
          <p className="text-base font-bold">{nickname || '집중러'}</p>
          <p className="mt-5 text-xs font-medium text-ink-muted">집중한 시간</p>
          <p className="mt-1 font-mono text-[40px] font-bold leading-none tracking-tight text-clay-dark">
            {formatTime(totalSeconds)}
          </p>
          <p className="mt-5 text-[13px] text-ink-soft">{getMessage(totalSeconds)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button onClick={() => navigate('/')} className="btn-primary">
          처음으로 돌아가기
        </button>
        <ExitButton />
      </div>
    </DraggableLayout>
  )
}

export default ResultScreen
