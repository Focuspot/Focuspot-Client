import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import DraggableLayout from '../components/DraggableLayout'
import BackButton from '../components/BackButton'
import { CHARACTERS, DefaultCharacterId } from '../characters'

function ProfileSetup(): React.JSX.Element {
  const navigate = useNavigate()
  const mode = useAppStore((state) => state.mode)
  const roomCode = useAppStore((state) => state.roomCode)
  const nickname = useAppStore((state) => state.nickname)
  const character = useAppStore((state) => state.character)
  const setNickname = useAppStore((state) => state.setNickname)
  const setCharacter = useAppStore((state) => state.setCharacter)
  const setCustomImage = useAppStore((state) => state.setCustomImage)
  const customImage = useAppStore((state) => state.customImage)

  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (): void => {
      setCustomImage(reader.result as string)
      setCharacter('custom')
      setFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleSelectDefault = (id: DefaultCharacterId): void => {
    setCharacter(id)
    setCustomImage(null)
    setFileName(null)
  }

  const canStart = nickname.trim().length > 0

  return (
    <DraggableLayout className="px-7 pb-7">
      <div className="mb-6 flex items-center gap-3">
        <BackButton onClick={() => navigate(mode === 'multi' ? '/room' : '/')} />
        <div>
          <p className="text-base font-bold leading-tight">프로필 설정</p>
          <p className="text-xs text-ink-muted">
            {mode === 'multi' && roomCode ? `방 ${roomCode} 에 입장해요` : '혼자 집중 모드'}
          </p>
        </div>
      </div>

      <div className="-mx-1 flex-1 overflow-y-auto px-1 pb-2">
        <p className="label">닉네임</p>
        <div className="relative mb-6">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 10))}
            onKeyDown={(e) => e.key === 'Enter' && canStart && navigate('/overlay')}
            placeholder="어떻게 불러드릴까요?"
            className="field pr-14"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-ink-muted">
            {nickname.length}/10
          </span>
        </div>

        <p className="label">캐릭터</p>
        <div className="mb-3 grid grid-cols-3 gap-2.5">
          {CHARACTERS.map((c) => {
            const selected = character === c.id
            return (
              <button
                key={c.id}
                onClick={() => handleSelectDefault(c.id)}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 bg-white py-3.5 transition ${
                  selected
                    ? 'border-clay shadow-card'
                    : 'border-transparent shadow-card hover:border-cream-300'
                }`}
              >
                <img
                  src={c.image}
                  alt={c.label}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-cream-100"
                  draggable={false}
                />
                <span
                  className={`text-xs font-semibold ${selected ? 'text-clay-dark' : 'text-ink-soft'}`}
                >
                  {c.label}
                </span>
                {selected && (
                  <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[9px] text-white">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <label
          className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-3 transition ${
            character === 'custom'
              ? 'border-clay bg-clay-light/40'
              : 'border-cream-300 hover:border-clay/50'
          }`}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={handleFileUpload}
            className="hidden"
          />
          {customImage ? (
            <img
              src={customImage}
              alt="미리보기"
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-200 text-lg text-ink-soft">
              +
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-ink">
              {fileName ?? '내 이미지 올리기'}
            </span>
            <span className="block text-[11px] text-ink-muted">
              PNG · JPG · GIF — 이번 세션에서만 사용돼요
            </span>
          </span>
        </label>
      </div>

      <button
        onClick={() => navigate('/overlay')}
        disabled={!canStart}
        className="btn-primary mt-4"
      >
        집중 시작하기
      </button>
    </DraggableLayout>
  )
}

export default ProfileSetup
