import { create } from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'

type Mode = 'solo' | 'multi' | null
type Character = 'cat' | 'hamster' | 'dog' | 'custom'
export type Theme = 'system' | 'light' | 'dark'

/** 'YYYY-MM-DD' (로컬 시간 기준) */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

interface AppState {
  mode: Mode
  nickname: string
  character: Character
  customImage: string | null // base64
  roomCode: string
  totalSeconds: number // 방금 끝난 세션 시간
  dailySeconds: Record<string, number> // 날짜별 누적 집중 시간
  theme: Theme

  setMode: (mode: Mode) => void
  setNickname: (nickname: string) => void
  setCharacter: (character: Character) => void
  setCustomImage: (customImage: string | null) => void
  setRoomCode: (code: string) => void
  finishSession: (seconds: number) => void
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = 'focuspot'

/**
 * localStorage 용량(약 5MB)을 넘기면 업로드 이미지 없이라도 저장한다.
 * (큰 GIF를 올려도 닉네임/기록은 남도록)
 */
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      try {
        const parsed = JSON.parse(value)
        parsed.state.customImage = null
        if (parsed.state.character === 'custom') parsed.state.character = 'cat'
        localStorage.setItem(name, JSON.stringify(parsed))
      } catch {
        // 저장 실패 시 이번 실행 동안만 유지
      }
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      // ignore
    }
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: null,
      nickname: '',
      character: 'cat',
      customImage: null,
      roomCode: '',
      totalSeconds: 0,
      dailySeconds: {},
      theme: 'system',

      setMode: (mode) => set({ mode }),
      setNickname: (nickname) => set({ nickname }),
      setCharacter: (character) => set({ character }),
      setCustomImage: (customImage) => set({ customImage }),
      setRoomCode: (roomCode) => set({ roomCode }),
      setTheme: (theme) => set({ theme }),
      finishSession: (seconds) =>
        set((state) => {
          const key = todayKey()
          return {
            totalSeconds: seconds,
            dailySeconds: { ...state.dailySeconds, [key]: (state.dailySeconds[key] ?? 0) + seconds }
          }
        })
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      // 세션 중 상태(mode, roomCode, totalSeconds)는 저장하지 않음
      partialize: (state) => ({
        nickname: state.nickname,
        character: state.character,
        customImage: state.customImage,
        dailySeconds: state.dailySeconds,
        theme: state.theme
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>
        const merged = { ...current, ...p }
        if (merged.character === 'custom' && !merged.customImage) merged.character = 'cat'
        return merged
      }
    }
  )
)

/** 오늘 포함 연속으로 집중한 날 수 */
export function getStreak(dailySeconds: Record<string, number>): number {
  let streak = 0
  const d = new Date()
  // 오늘 기록이 없으면 어제부터 센다
  if (!dailySeconds[todayKey(d)]) d.setDate(d.getDate() - 1)
  while (dailySeconds[todayKey(d)]) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}
