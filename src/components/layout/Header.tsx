import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getLevelInfo, getLevelProgress, getNextLevel } from '../../data/levels'

export function Header() {
  const { totalXP, currentStreak, longestStreak } = useGameStore()
  const levelInfo = getLevelInfo(totalXP)
  const nextLevel = getNextLevel(totalXP)
  const progress = getLevelProgress(totalXP)

  const streakIcon = currentStreak >= 10 ? '⚡' : currentStreak >= 5 ? '🔥🔥' : currentStreak >= 3 ? '🔥' : null

  return (
    <header className="bg-brand-card border-b border-white/10 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl">🌵</span>
          <span className="font-display font-bold text-sm text-white hidden sm:block">AZ Exam Prep</span>
        </div>

        {/* XP + Level */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{levelInfo.icon}</span>
            <span className={`text-xs font-semibold ${levelInfo.color}`}>{levelInfo.name}</span>
            <span className="text-amber-400 text-xs font-bold ml-auto">{totalXP.toLocaleString()} XP</span>
          </div>
          {/* XP Bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          {nextLevel && (
            <div className="text-[10px] text-slate-500 mt-0.5">
              {nextLevel.minXP - totalXP} XP to {nextLevel.name}
            </div>
          )}
        </div>

        {/* Streak */}
        {currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0 flex flex-col items-center"
          >
            <div className="text-lg leading-none">
              {streakIcon ?? '✨'}
            </div>
            <div className="text-[10px] font-bold text-amber-400">{currentStreak}x</div>
          </motion.div>
        )}
      </div>
    </header>
  )
}
