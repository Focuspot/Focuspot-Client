import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import DraggableLayout from '../components/DraggableLayout'
import BackButton from '../components/BackButton'

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function RoomScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const setRoomCode = useAppStore((state) => state.setRoomCode)
  const [tab, setTab] = useState<'create' | 'join'>('create')
  const [createdCode] = useState(generateRoomCode)
  const [joinInput, setJoinInput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleEnterCreated = (): void => {
    setRoomCode(createdCode)
    navigate('/profile')
  }

  const handleJoin = (): void => {
    if (joinInput.length !== 6) return
    setRoomCode(joinInput.toUpperCase())
    navigate('/profile')
  }

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(createdCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // 클립보드 접근 실패 시 무시
    }
  }

  return (
    <DraggableLayout className="px-7 pb-7">
      <div className="mb-6 flex items-center gap-3">
        <BackButton onClick={() => navigate('/')} />
        <p className="text-base font-bold">친구와 같이하기</p>
      </div>

      <div className="mb-8 flex rounded-2xl bg-cream-200 p-1">
        {(
          [
            ['create', '방 만들기'],
            ['join', '방 참가하기']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
              tab === id ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink-soft'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'create' ? (
        <div className="flex flex-1 flex-col">
          <p className="label">방 코드</p>
          <div className="rounded-3xl border-2 border-dashed border-clay/40 bg-clay-light/40 px-6 py-7 text-center">
            <p className="font-mono text-[32px] font-bold tracking-[0.25em] text-clay-dark">
              {createdCode}
            </p>
            <button
              onClick={handleCopy}
              className="mt-3 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-soft shadow-card transition hover:text-clay-dark"
            >
              {copied ? '복사됐어요 ✓' : '코드 복사'}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-ink-muted">친구에게 이 코드를 알려주세요</p>
          <button onClick={handleEnterCreated} className="btn-primary mt-auto">
            방 입장하기
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <p className="label">초대 코드</p>
          <input
            value={joinInput}
            onChange={(e) =>
              setJoinInput(
                e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
                  .slice(0, 6)
              )
            }
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="ABC123"
            autoFocus
            className="field py-5 text-center font-mono text-2xl font-bold tracking-[0.3em] placeholder:font-normal placeholder:text-cream-300"
          />
          <p className="mt-3 text-center text-xs text-ink-muted">
            친구에게 받은 6자리 코드를 입력하세요
          </p>
          <button
            onClick={handleJoin}
            disabled={joinInput.length !== 6}
            className="btn-sage mt-auto"
          >
            참가하기
          </button>
        </div>
      )}
    </DraggableLayout>
  )
}

export default RoomScreen
