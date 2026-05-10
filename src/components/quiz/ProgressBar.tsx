import { motion } from 'framer-motion'

interface Props {
  current: number
  total: number
  correct: number
}

export function ProgressBar({ current, total, correct }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-slate-400">
        <span>Question {current + 1} of {total}</span>
        <span className="text-emerald-400 font-medium">{correct} correct</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
