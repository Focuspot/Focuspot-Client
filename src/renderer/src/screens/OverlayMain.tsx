import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
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

  const characterImage = customImage ?? CHARACTER_IMAGES[character as keyof typeof CHARACTER_IMAGES]

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
    setBubble(bubbleInput)
    setShowInput(false)
    setBubbleInput('')
  }

  return (
    <div
      className="flex flex-col h-screen items-center justify-center select-none relative"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* 말풍선 */}
      <div
        className="mb-2 cursor-pointer"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        onClick={() => {
          setBubbleInput(bubble)
          setShowInput(true)
        }}
      >
        {bubble ? (
          <div className="bg-violet-600/70 text-violet-100 border border-violet-400/50 rounded-xl px-1 py-1 text-xs max-w-[130px] text-center">
            {bubble}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-xl px-3 py-1 text-xs text-gray-400">
            + 한마디
          </div>
        )}
      </div>

      {/* 캐릭터 */}
      <img
        src={characterImage}
        alt="character"
        className="w-16 h-16 rounded-full object-cover border-2 border-violet-400/40"
      />

      {/* 닉네임 */}
      <p className="text-gray-400 text-[10px] mt-1">{nickname}</p>

      {/* 타이머 + 나가기 */}
      <div
        className="flex items-center gap-2 mt-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          className={`text-sm font-mono px-2 py-1 rounded-lg border ${
            isRunning
              ? 'text-white border-green-400/50 bg-green-400/40'
              : 'text-yellow-300 border-yellow-400/30 bg-yellow-400/10'
          }`}
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
        >
          {formatTime(seconds)}
        </button>
        <button
          onClick={() => {
            setTotalSeconds(seconds)
            navigate('/result')
          }}
          className="text-gray-300 border rounded-lg px-2 py-1 border-red-400/50 bg-red-400/20 hover:text-red-400 text-sm"
        >
          ✕
        </button>
      </div>

      {/* 말풍선 입력 팝업 */}
      {showInput && (
        <div
          className="absolute inset-0 flex items-end pb-4 justify-center"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <div className="bg-[#22222c] border border-white/10 rounded-2xl p-4 w-[90%]">
            <input
              value={bubbleInput}
              onChange={(e) => setBubbleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBubbleSubmit()}
              placeholder="한마디 입력..."
              autoFocus
              className="w-full bg-[#2c2c38] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowInput(false)}
                className="flex-1 py-2 rounded-xl border border-white/10 text-gray-300 text-xs"
              >
                취소
              </button>
              <button
                onClick={handleBubbleSubmit}
                className="flex-1 py-2 rounded-xl bg-violet-400 text-gray-300 text-xs font-medium"
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
