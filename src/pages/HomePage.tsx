import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { CATEGORIES } from '../data/categories'
import { CategoryCard } from '../components/home/CategoryCard'
import { getLevelInfo } from '../data/levels'

const MODES = [
  {
    id: 'quick',
    label: 'Quick Practice',
    icon: '⚡',
    desc: '10 random questions',
    gradient: 'from-violet-600 to-purple-700',
    path: '/quiz?mode=quick',
  },
  {
    id: 'exam',
    label: 'Exam Simulation',
    icon: '📝',
    desc: '50 questions · 60 min',
    gradient: 'from-rose-600 to-red-700',
    path: '/exam',
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    icon: '🃏',
    desc: 'Flip & study key concepts',
    gradient: 'from-teal-600 to-emerald-700',
    path: '/flashcards',
  },
  {
    id: 'review',
    label: 'Wrong Answers',
    icon: '🎯',
    desc: 'Re-test your mistakes',
    gradient: 'from-amber-600 to-orange-700',
    path: '/review',
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const { totalXP, questionsAnswered, questionsCorrect, currentStreak, wrongAnswerIds } = useGameStore()
  const levelInfo = getLevelInfo(totalXP)
  const accuracy = questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-900/40 to-brand-card rounded-2xl p-5 border border-violet-500/20"
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">{levelInfo.icon}</span>
          <div>
            <h1 className="font-display font-bold text-xl text-white">AZ Life Insurance</h1>
            <p className="text-slate-400 text-sm">Exam Prep · {levelInfo.name} Level</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Questions', value: questionsAnswered },
            { label: 'Accuracy', value: `${accuracy}%` },
            { label: 'Streak', value: `${currentStreak}🔥` },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-2.5 text-center">
              <div className="font-bold text-white text-lg">{stat.value}</div>
              <div className="text-slate-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mode cards */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Choose Your Mode</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((mode, i) => (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(mode.path)}
              className={`bg-gradient-to-br ${mode.gradient} rounded-2xl p-4 text-left border border-white/10 relative overflow-hidden`}
            >
              <div className="text-2xl mb-2">{mode.icon}</div>
              <div className="font-semibold text-white text-sm">{mode.label}</div>
              <div className="text-white/60 text-xs mt-0.5">{mode.desc}</div>
              {mode.id === 'review' && wrongAnswerIds.length > 0 && (
                <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wrongAnswerIds.length}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Study by Topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <CategoryCard category={cat} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer tip */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-slate-600 pb-2"
      >
        🌵 AZ Life Insurance Exam Prep · 91 real exam-style questions
      </motion.p>
    </div>
  )
}
