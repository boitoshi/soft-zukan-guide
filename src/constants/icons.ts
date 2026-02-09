/**
 * 共有アイコン・スタイル定数
 * ゲーム・地域に関連するアイコンやCSSクラスを一元管理
 */

/** ゲームIDから絵文字アイコンを取得 */
export const GAME_ICON_MAP: Record<string, string> = {
  test: '🧪',
  paldea: '🏔️',
  galar: '⚔️',
  usum: '🌺',
  sm: '🌺',
  oras: '🌊',
  xy: '🗼',
}

export function getGameIcon(gameId: string): string {
  return GAME_ICON_MAP[gameId] ?? '🎮'
}

/** 地域IDから絵文字アイコンを取得 */
export const REGION_ICON_MAP: Record<string, string> = {
  paldea: '🏔️',
  kitakami: '🍂',
  blueberry: '🫐',
  galar: '⚔️',
  crown_tundra: '❄️',
  isle_of_armor: '🏝️',
  alola: '🌺',
  hoenn: '🌊',
  kalos: '🗼',
}

export function getRegionIcon(regionId: string): string {
  return REGION_ICON_MAP[regionId] ?? '📍'
}

/** 地域IDからTailwindバッジクラスを取得 */
export const REGION_CLASS_MAP: Record<string, string> = {
  paldea: 'bg-blue-100 text-blue-800',
  kitakami: 'bg-orange-100 text-orange-800',
  blueberry: 'bg-purple-100 text-purple-800',
  galar: 'bg-green-100 text-green-800',
  armor: 'bg-yellow-100 text-yellow-800',
  crown: 'bg-pink-100 text-pink-800',
  isle_of_armor: 'bg-yellow-100 text-yellow-800',
  crown_tundra: 'bg-pink-100 text-pink-800',
  alola: 'bg-rose-100 text-rose-800',
  kalos: 'bg-sky-100 text-sky-800',
  hoenn: 'bg-cyan-100 text-cyan-800',
}

export function getRegionClass(regionId: string): string {
  return REGION_CLASS_MAP[regionId] ?? 'bg-gray-100 text-gray-800'
}

/** バージョンの短縮ラベル（一覧表示用） */
export const SHORT_VERSION_LABELS: Record<string, string> = {
  scarlet: 'S',
  violet: 'V',
  sword: '剣',
  shield: '盾',
  sun: 'S',
  moon: 'M',
  ultra_sun: 'US',
  ultra_moon: 'UM',
  omega_ruby: 'OR',
  alpha_sapphire: 'AS',
  x: 'X',
  y: 'Y',
}

export function shortenVersionLabel(label: string, availability: string): string {
  if (SHORT_VERSION_LABELS[availability]) {
    return SHORT_VERSION_LABELS[availability]
  }
  const parts = label.split(' ')
  const withoutEmoji = parts.length > 1 ? parts.slice(1).join(' ') : label
  const trimmed = withoutEmoji.replace('限定', '').trim()
  if (!trimmed) return label
  return trimmed.length > 2 ? trimmed.slice(0, 2) : trimmed
}
