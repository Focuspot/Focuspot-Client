import catImg from './assets/characters/cat.gif'
import hamsterImg from './assets/characters/hamster.gif'
import dogImg from './assets/characters/dog.gif'

export const CHARACTERS = [
  { id: 'cat', image: catImg, label: '고양이' },
  { id: 'hamster', image: hamsterImg, label: '햄스터' },
  { id: 'dog', image: dogImg, label: '강아지' }
] as const

export type DefaultCharacterId = (typeof CHARACTERS)[number]['id']

export function getCharacterImage(character: string, customImage: string | null): string {
  if (customImage) return customImage
  return (CHARACTERS.find((c) => c.id === character) ?? CHARACTERS[0]).image
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
