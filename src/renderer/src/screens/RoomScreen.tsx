import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import DraggableLayout from '../components/DraggableLayout'

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

  const handleEnterCreated = (): void => {
    setRoomCode(createdCode)
    navigate('/profile')
  }

  const handleJoin = (): void => {
    if (joinInput.length !== 6) return
    setRoomCode(joinInput.toUpperCase())
    navigate('/profile')
  }

  return (
    <DraggableLayout className="px-7 py-6">
      <button
        onClick={() => navigate('/')}
        className="text-white/40 text-xs flex items-center gap-1 mb-6 w-fit"
      >
        ← 뒤로
      </button>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('create')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            tab === 'create' ? 'bg-violet-400/20 text-violet-300' : 'text-white/40'
          }`}
        >
          방 만들기
        </button>
        <button
          onClick={() => setTab('join')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            tab === 'join' ? 'bg-sky-400/20 text-sky-300' : 'text-white/40'
          }`}
        >
          방 참가하기
        </button>
      </div>

      {tab === 'create' ? (
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-white/40 text-xs">6자리 코드가 자동 생성되었습니다</p>
          <div className="bg-[#25252d] border border-white/10 rounded-xl px-6 py-4 w-full text-center">
            <p className="text-white/30 text-[11px] mb-2">방 코드</p>
            <p className="text-violet-300 text-2xl font-medium tracking-[0.25em]">{createdCode}</p>
          </div>
          <p className="text-white/30 text-[11px]">친구에게 이 코드를 알려주세요</p>
          <button
            onClick={handleEnterCreated}
            className="w-full py-3 rounded-xl bg-violet-400 text-white text-sm font-medium mt-2"
          >
            방 입장하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-white/40 text-xs">친구에게 받은 코드를 입력하세요</p>
          <input
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="______"
            className="w-full bg-[#25252d] border border-white/10 rounded-xl px-4 py-3 text-center text-lg tracking-[0.3em] text-white outline-none"
          />
          <button
            onClick={handleJoin}
            disabled={joinInput.length !== 6}
            className="w-full py-3 rounded-xl bg-sky-300 text-[#0a2030] text-sm font-medium disabled:opacity-40 mt-2"
          >
            참가하기
          </button>
        </div>
      )}
    </DraggableLayout>
  )
}

export default RoomScreen
