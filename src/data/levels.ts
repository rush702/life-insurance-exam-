import type { LevelInfo } from '../types'

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Rookie',        icon: '🌱', minXP: 0,    maxXP: 99,   color: 'text-slate-400' },
  { level: 2, name: 'Trainee',       icon: '📚', minXP: 100,  maxXP: 299,  color: 'text-blue-400' },
  { level: 3, name: 'Licensed Agent', icon: '🤝', minXP: 300,  maxXP: 599,  color: 'text-green-400' },
  { level: 4, name: 'Senior Agent',  icon: '⭐', minXP: 600,  maxXP: 999,  color: 'text-yellow-400' },
  { level: 5, name: 'Expert',        icon: '🏆', minXP: 1000, maxXP: 2999, color: 'text-purple-400' },
  { level: 6, name: 'Master Broker', icon: '💎', minXP: 3000, maxXP: Infinity, color: 'text-cyan-400' },
]

export const getLevelInfo = (xp: number): LevelInfo => {
  return [...LEVELS].reverse().find(l => xp >= l.minXP) ?? LEVELS[0]
}

export const getNextLevel = (xp: number): LevelInfo | null => {
  const current = getLevelInfo(xp)
  return LEVELS.find(l => l.level === current.level + 1) ?? null
}

export const getLevelProgress = (xp: number): number => {
  const current = getLevelInfo(xp)
  const next = getNextLevel(xp)
  if (!next) return 100
  const range = next.minXP - current.minXP
  const progress = xp - current.minXP
  return Math.min(100, Math.round((progress / range) * 100))
}
