import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface Props {
  milestone: number | null
  onDismiss: () => void
}

const messages: Record<number, { emoji: string; text: string; sub: string }> = {
  3:  { emoji: '🔥',      text: 'On Fire!',     sub: '3 in a row!' },
  5:  { emoji: '🔥🔥',   text: 'Blazing!',     sub: '5 correct streak!' },
  10: { emoji: '⚡',      text: 'Unstoppable!', sub: '10 in a row! LEGENDARY!' },
  15: { emoji: '💥',      text: 'Insane!',      sub: '15 streak! You\'re crushing it!' },
  20: { emoji: '🏆',      text: 'GOAT Mode',    sub: '20 in a row! Exam ready!' },
}

const getMsg = (n: number) => {
  const keys = Object.keys(messages).map(Number).sort((a, b) => b - a)
  const key = keys.find(k => n >= k) ?? 3
  return messages[key]
}

export function StreakBanner({ milestone, onDismiss }: Props) {
  useEffect(() => {
    if (!milestone) return
    const t = setTimeout(onDismiss, 2500)
    return () => clearTimeout(t)
  }, [milestone, onDismiss])

  const msg = milestone ? getMsg(milestone) : null

  return (
    <AnimatePresence>
      {milestone && msg && (
        <motion.div
          initial={{ y: -60, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -60, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl px-6 py-3 shadow-2xl text-center"
          onClick={onDismiss}
        >
          <div className="text-3xl leading-none mb-1">{msg.emoji}</div>
          <div className="font-display font-bold text-white text-lg leading-tight">{msg.text}</div>
          <div className="text-amber-100 text-sm">{msg.sub}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
