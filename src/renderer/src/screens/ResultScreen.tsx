import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import DraggableLayout from '../components/DraggableLayout'
import ExitButton from '../components/ExitButton'
import catImg from '../assets/characters/cat.png'
import hamsterImg from '../assets/characters/hamster.png'
import dogImg from '../assets/characters/dog.png'

const CHARACTER_IMAGES = {
  cat: catImg,
  hamster: hamsterImg,
  dog: dogImg
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function ResultScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const nickname = useAppStore((state) => state.nickname)
  const character = useAppStore((state) => state.character)
  const customImage = useAppStore((state) => state.customImage)
  const totalSeconds = useAppStore((state) => state.totalSeconds)

  const characterImage = customImage ?? CHARACTER_IMAGES[character as keyof typeof CHARACTER_IMAGES]

  return (
    <DraggableLayout className="items-center justify-center px-7 gap-5">
      <p className="text-white/40 text-xs">오늘의 집중 결과</p>

      <img
        src={characterImage}
        alt="character"
        className="w-20 h-20 rounded-full object-cover border-2 border-violet-400/40"
      />

      <div className="flex flex-col items-center gap-1">
        <p className="text-white text-base font-medium">{nickname}</p>
        <p className="text-white/50 text-xs">오늘 집중한 시간</p>
        <p className="text-violet-300 text-3xl font-mono font-medium">{formatTime(totalSeconds)}</p>
      </div>

      <div className="flex flex-col gap-3 w-56 mt-2">
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 rounded-xl bg-violet-400 text-white text-sm font-medium"
        >
          메인으로 돌아가기
        </button>
        <ExitButton />
      </div>
    </DraggableLayout>
  )
}

export default ResultScreen
