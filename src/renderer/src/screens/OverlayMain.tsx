import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { formatTime, getCharacterImage } from '../characters'

function OverlayMain(): React.JSX.Element {
  const navigate = useNavigate()
  const nickname = useAppStore((state) => state.nickname)
  const character = useAppStore((state) => state.character)
  const customImage = useAppStore((state) => state.customImage)
  const setTotalSeconds = useAppStore((state) => state.setTotalSeconds)

  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [bubble, setBubble] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [bubbleInput, setBubbleInput] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const characterImage = getCharacterImage(character, customImage)

  useEffect(() => {
    window.electron.ipcRenderer.send('resize-overlay')
    return () => {
      window.electron.ipcRenderer.send('resize-setup')
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const handleBubbleSubmit = (): void => {
    setBubble(bubbleInput.trim())
    setShowInput(false)
    setBubbleInput('')
  }

  const handleFinish = (): void => {
    setTotalSeconds(seconds)
    navigate('/result')
  }

  return (
    <div className="drag relative flex h-screen select-none flex-col items-center justify-center text-ink">
      {/* 말풍선 */}
      <button
        className="no-drag mb-2 max-w-[150px]"
        onClick={() => {
          setBubbleInput(bubble)
          setShowInput(true)
        }}
      >
        {bubble ? (
          <div className="relative rounded-2xl bg-white px-3 py-1.5 text-[11px] font-medium leading-snug text-ink shadow-float">
            <span className="line-clamp-2 break-all">{bubble}</span>
            <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-white" />
          </div>
        ) : (
          <div className="rounded-full border border-dashed border-ink-muted/60 bg-white/70 px-2.5 py-0.5 text-[10px] font-medium text-ink-soft backdrop-blur transition hover:bg-white">
            + 한마디
          </div>
        )}
      </button>

      {/* 캐릭터 */}
      <div className={`relative ${isRunning ? 'animate-bob' : ''}`}>
        <img
          src={characterImage}
          alt="character"
          className="h-16 w-16 rounded-full object-cover shadow-float ring-[3px] ring-white"
          draggable={false}
        />
        <span
          className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-white ${
            isRunning ? 'bg-sage' : 'bg-amber-400'
          }`}
        />
      </div>

      {nickname && (
        <p className="mt-1.5 max-w-[140px] truncate rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-ink-soft shadow-card backdrop-blur">
          {nickname}
        </p>
      )}

      {/* 타이머 컨트롤 */}
      <div className="no-drag mt-2 flex items-center gap-1 rounded-full bg-white py-1 pl-1 pr-1 shadow-float">
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          title={isRunning ? '일시정지' : '다시 시작'}
          className="flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-cream-100"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isRunning ? 'animate-pulse-dot bg-sage' : 'bg-amber-400'
            }`}
          />
          <span
            className={`font-mono text-[13px] font-bold tabular-nums ${
              isRunning ? 'text-ink' : 'text-ink-muted'
            }`}
          >
            {formatTime(seconds)}
          </span>
        </button>
        <button
          onClick={handleFinish}
          title="집중 끝내기"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-clay text-white transition hover:bg-clay-dark"
        >
          <span className="h-2 w-2 rounded-[2px] bg-white" />
        </button>
      </div>

      {/* 말풍선 입력 팝업 */}
      {showInput && (
        <div className="no-drag absolute inset-0 flex items-end justify-center pb-3">
          <div className="w-[92%] rounded-2xl border border-cream-300 bg-cream-50 p-2.5 shadow-float">
            <input
              value={bubbleInput}
              onChange={(e) => setBubbleInput(e.target.value.slice(0, 30))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleBubbleSubmit()
                if (e.key === 'Escape') setShowInput(false)
              }}
              placeholder="지금 뭐 하고 있나요?"
              autoFocus
              className="mb-2 w-full rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 text-[11px] text-ink outline-none focus:border-clay"
            />
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowInput(false)}
                className="flex-1 rounded-lg py-1.5 text-[11px] font-medium text-ink-muted hover:bg-cream-100"
              >
                취소
              </button>
              <button
                onClick={handleBubbleSubmit}
                className="flex-1 rounded-lg bg-clay py-1.5 text-[11px] font-semibold text-white hover:bg-clay-dark"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OverlayMain
