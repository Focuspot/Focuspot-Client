import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

function StartScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const setMode = useAppStore((state) => state.setMode)

  const handleSole = (): void => {
    setMode('solo')
    navigate('/profile')
  }

  const handleMulti = (): void => {
    setMode('multi')
    navigate('/room')
  }

  return (
    <div
      className="flex flex-col h-screen items-center justify-center gap-6 select-none bg-[#1a1a1f]"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl">🐾</span>
        <p className="text-white text-lg font-medium">FocusPot</p>
        <p className="text-white/40 text-xs">친구들과 함께하는 집중 타이머</p>
      </div>

      <div
        className="flex flex-col gap-3 w-56"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={handleSole}
          className="w-full py-3 rounded-xl bg-violet-400 text-white text-sm font-medium"
        >
          혼자하기
        </button>
        <button
          onClick={handleMulti}
          className="w-full py-3 rounded-xl border border-white/20 text-white/80 text-sm font-medium"
        >
          같이하기
        </button>
      </div>
    </div>
  )
}

export default StartScreen
