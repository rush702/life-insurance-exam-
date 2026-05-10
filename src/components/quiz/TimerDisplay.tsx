import { motion } from 'framer-motion'

interface Props {
  formattedTime: string
  isWarning: boolean
  isCritical: boolean
}

export function TimerDisplay({ formattedTime, isWarning, isCritical }: Props) {
  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${
        isCritical
          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          : isWarning
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          : 'bg-white/10 text-slate-300 border border-white/10'
      }`}
    >
      <span>⏱</span>
      <span>{formattedTime}</span>
    </motion.div>
  )
}
