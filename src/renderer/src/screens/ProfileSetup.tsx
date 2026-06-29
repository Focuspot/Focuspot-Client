import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import DraggableLayout from '../components/DraggableLayout'
import hamsterImg from '../assets/characters/hamster.png'
import catImg from '../assets/characters/cat.png'
import dogImg from '../assets/characters/dog.png'

const CHARACTERS = [
  { id: 'cat', image: catImg, label: '고양이' },
  { id: 'hamster', image: hamsterImg, label: '햄스터' },
  { id: 'dog', image: dogImg, label: '강아지' }
] as const

function ProfileSetup(): React.JSX.Element {
  const navigate = useNavigate()
  const mode = useAppStore((state) => state.mode)
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

  const handleSelectDefault = (id: (typeof CHARACTERS)[number]['id']): void => {
    setCharacter(id)
    setCustomImage(null)
    setFileName(null)
  }

  const handleStart = (): void => {
    navigate('/overlay')
  }

  return (
    <DraggableLayout className="px-7 py-6 overflow-y-auto">
      <button
        onClick={() => navigate(mode === 'multi' ? '/room' : '/')}
        className="text-white/40 text-xs flex items-center gap-1 mb-6 w-fit"
      >
        ← 뒤로
      </button>

      <p className="text-white text-lg font-medium mb-1">프로필 설정</p>
      <p className="text-white/40 text-xs mb-7">닉네임과 캐릭터를 선택하세요</p>

      <p className="text-white/50 text-xs mb-2">닉네임</p>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value.slice(0, 10))}
        placeholder="닉네임 입력 (최대 10자)"
        className="bg-[#25252d] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none mb-6"
      />

      <p className="text-white/50 text-xs mb-3">캐릭터 선택</p>
      <div className="flex gap-2 mb-6">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelectDefault(c.id)}
            className={`flex-1 flex flex-col items-center gap-2 rounded-xl py-3 border ${
              character === c.id
                ? 'border-violet-400 bg-violet-400/10'
                : 'border-white/10 bg-[#25252d]'
            }`}
          >
            <img src={c.image} alt={c.label} className="w-10 h-10 rounded-full object-cover" />
            <span
              className={`text-xs font-medium ${
                character === c.id ? 'text-violet-300' : 'text-white/50'
              }`}
            >
              {c.label}
            </span>
          </button>
        ))}
      </div>

      <div className="border-t border-white/10 pt-4 mb-6">
        <p className="text-white/50 text-xs mb-2">직접 업로드</p>
        <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-xl py-3 text-xs text-white/50 cursor-pointer">
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={handleFileUpload}
            className="hidden"
          />
          {fileName ?? '이미지 / GIF 파일 선택 (PNG · JPG · GIF)'}
        </label>
        <p className="text-white/30 text-[11px] mt-2">
          서버에 저장되지 않아요 — 세션 동안만 사용됩니다
        </p>
        {customImage && (
          <img
            src={customImage}
            alt="미리보기"
            className="mt-3 w-14 h-14 rounded-full object-cover mx-auto border border-white/10"
          />
        )}
      </div>

      <button
        onClick={handleStart}
        disabled={nickname.trim().length === 0}
        className="w-full py-3 rounded-xl bg-violet-400 text-white text-sm font-medium disabled:opacity-40 mt-auto"
      >
        시작하기
      </button>
    </DraggableLayout>
  )
}

export default ProfileSetup
