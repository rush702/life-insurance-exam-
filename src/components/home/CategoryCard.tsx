import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { CategoryMeta } from '../../types'
import { useGameStore } from '../../store/useGameStore'
import { QUESTIONS } from '../../data/questions'

interface Props {
  category: CategoryMeta
}

export function CategoryCard({ category }: Props) {
  const navigate = useNavigate()
  const { questionHistory } = useGameStore()

  const catQuestions = QUESTIONS.filter(q => q.category === category.id)
  const attempted = catQuestions.filter(q => questionHistory[q.id]).length
  const correct = catQuestions.filter(q => (questionHistory[q.id]?.timesCorrect ?? 0) > 0).length
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : null

  const handleClick = () => {
    navigate(`/quiz?mode=category&category=${category.id}`)
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left bg-gradient-to-br ${category.gradient} rounded-2xl p-4 border border-white/10 transition-all`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{category.icon}</span>
        {accuracy !== null && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            accuracy >= 80 ? 'bg-emerald-500/30 text-emerald-300' :
            accuracy >= 60 ? 'bg-amber-500/30 text-amber-300' :
            'bg-rose-500/30 text-rose-300'
          }`}>
            {accuracy}%
          </span>
        )}
      </div>
      <div className="font-semibold text-white text-sm leading-tight mb-1">{category.label}</div>
      <div className="text-white/60 text-xs leading-snug">{category.description}</div>
      <div className="mt-2.5 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/40 rounded-full transition-all duration-500"
          style={{ width: `${catQuestions.length > 0 ? (attempted / catQuestions.length) * 100 : 0}%` }}
        />
      </div>
      <div className="text-[10px] text-white/40 mt-1">{attempted}/{catQuestions.length} attempted</div>
    </motion.button>
  )
}
