import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { useWindowSize } from '../hooks/useWindowSize'
import { ResultsCard } from '../components/results/ResultsCard'
import type { QuizSession } from '../types'

export function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const session = state?.session as QuizSession | undefined
  const examMode = state?.examMode as boolean | undefined
  const { width, height } = useWindowSize()
  const shown = useRef(false)

  const total = session?.questions.length ?? 0
  const correct = session?.answers.filter(a => a.isCorrect).length ?? 0
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const celebrate = pct >= 80

  useEffect(() => {
    shown.current = true
  }, [])

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-400">No session data found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-violet-400 underline text-sm">
          Go home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {celebrate && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          colors={['#7C3AED', '#F59E0B', '#10B981', '#EC4899', '#FFFFFF']}
        />
      )}

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display font-bold text-2xl text-white">
          {pct >= 70 ? '🎉 Great Job!' : '📚 Keep Practicing!'}
        </h1>
        {examMode && (
          <p className="text-sm text-slate-400 mt-1">
            {pct >= 70 ? 'You passed the exam simulation!' : 'You need 70% to pass the real exam.'}
          </p>
        )}
      </motion.div>

      {/* Results card */}
      <ResultsCard session={session} />

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={() => navigate('/review')}
          className="bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold py-3 rounded-xl text-sm hover:bg-amber-500/30 transition-colors"
        >
          📖 Review Wrong
        </button>
        <button
          onClick={() => navigate(-2)}
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          🔁 Play Again
        </button>
        <button
          onClick={() => navigate('/')}
          className="col-span-2 bg-white/10 hover:bg-white/15 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          🏠 Home
        </button>
      </motion.div>
    </div>
  )
}
