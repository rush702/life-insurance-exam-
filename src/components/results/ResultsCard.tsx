import { motion } from 'framer-motion'
import type { QuizSession } from '../../types'
import { CATEGORIES } from '../../data/categories'

interface Props {
  session: QuizSession
}

export function ResultsCard({ session }: Props) {
  const total = session.questions.length
  const correctCount = session.answers.filter(a => a.isCorrect).length
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const passed = pct >= 70

  // Per-category breakdown
  const catStats: Record<string, { correct: number; total: number }> = {}
  for (const q of session.questions) {
    const ans = session.answers.find(a => a.questionId === q.id)
    if (!catStats[q.category]) catStats[q.category] = { correct: 0, total: 0 }
    catStats[q.category].total++
    if (ans?.isCorrect) catStats[q.category].correct++
  }

  return (
    <div className="space-y-4">
      {/* Score circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="text-center"
      >
        <div className={`inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 ${
          passed ? 'border-emerald-500 bg-emerald-500/10' : 'border-rose-500 bg-rose-500/10'
        }`}>
          <span className="font-display font-bold text-4xl text-white">{pct}%</span>
          <span className={`text-sm font-bold ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
            {passed ? '✓ PASS' : '✗ FAIL'}
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-2">{correctCount} / {total} correct</p>
      </motion.div>

      {/* XP earned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center"
      >
        <span className="text-amber-400 font-bold text-lg">+{session.xpEarned} XP earned</span>
        <p className="text-amber-300/60 text-xs mt-0.5">this session</p>
      </motion.div>

      {/* Category breakdown */}
      {Object.keys(catStats).length > 1 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">By Topic</h3>
          {Object.entries(catStats).map(([catId, stats], i) => {
            const meta = CATEGORIES.find(c => c.id === catId)
            const catPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            return (
              <motion.div
                key={catId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm w-5 flex-shrink-0">{meta?.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 truncate">{meta?.label}</span>
                    <span className={catPct >= 70 ? 'text-emerald-400' : 'text-rose-400'}>
                      {stats.correct}/{stats.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${catPct >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${catPct}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
