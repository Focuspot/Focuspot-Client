import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import DraggableLayout from '../components/DraggableLayout'
import ExitButton from '../components/ExitButton'
import Logo, { Wordmark } from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

function StartScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const setMode = useAppStore((state) => state.setMode)

  const handleSolo = (): void => {
    setMode('solo')
    navigate('/profile')
  }

  const handleMulti = (): void => {
    setMode('multi')
    navigate('/room')
  }

  return (
    <DraggableLayout className="relative px-8 pb-6">
      <ThemeToggle className="absolute right-5 top-0" />
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative mb-5">
          <div className="absolute inset-x-5 bottom-2 h-3 rounded-full bg-cream-300/70 blur-[2px]" />
          <Logo size={120} className="relative animate-bob" />
        </div>
        <Wordmark className="text-[28px] leading-none" />
        <p className="mt-3 text-center text-[13px] leading-relaxed text-ink-soft">
          화분에 물 주듯, 하루의 집중을 키워요
          <br />
          <span className="text-ink-muted">친구들과 함께하는 집중 타이머</span>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={handleSolo} className="btn-primary">
          혼자 집중하기
        </button>
        <button onClick={handleMulti} className="btn-secondary">
          친구와 같이하기
        </button>
        <ExitButton />
      </div>
    </DraggableLayout>
  )
}

export default StartScreen
