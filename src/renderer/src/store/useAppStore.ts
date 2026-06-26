import { create } from 'zustand'

type Mode = 'solo' | 'multi' | null
type Character = 'cat' | 'hamster' | 'dog' | 'custom'

interface AppState {
  mode: Mode
  nickname: string
  character: Character
  customImage: string | null // base64
  roomCode: string

  setMode: (mode: Mode) => void
  setNickname: (nickname: string) => void
  setCharacter: (character: Character) => void
  setCustomImage: (customImage: string | null) => void
  setRoomCode: (code: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  mode: null,
  nickname: '',
  character: 'cat',
  customImage: null,
  roomCode: '',

  setMode: (mode) => set({ mode }),
  setNickname: (nickname) => set({ nickname }),
  setCharacter: (character) => set({ character }),
  setCustomImage: (customImage) => set({ customImage }),
  setRoomCode: (roomCode) => set({ roomCode })
}))
