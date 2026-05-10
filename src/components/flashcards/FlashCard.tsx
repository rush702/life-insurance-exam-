import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Question } from '../../types'
import { CATEGORIES } from '../../data/categories'
import { useGameStore } from '../../store/useGameStore'

interface Props {
  question: Question
  index: number
  total: number
}

export function FlashCard({ question, index, total }: Props) {
  const [flipped, setFlipped] = useState(false)
  const catMeta = CATEGORIES.find(c => c.id === question.category)
  const { masteredFlashcardIds, masterFlashcard } = useGameStore()
  const mastered = masteredFlashcardIds.includes(question.id)

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="text-center text-sm text-slate-400 mb-4">
        Card {index + 1} of {total}
      </div>

      {/* 3D Flip Card */}
      <div
        className="relative h-64 cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-brand-card border border-white/10 rounded-2xl p-6 flex flex-col"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span>{catMeta?.icon}</span>
              <span className="text-xs text-slate-400">{catMeta?.label}</span>
              <span className="ml-auto text-xs text-slate-500">Tap to flip</span>
            </div>
            <p className="text-white font-medium text-base leading-relaxed flex-1 flex items-center">
              {question.question}
            </p>
            <div className="text-center text-slate-600 text-xs mt-2">📖 Question</div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-violet-900/50 to-brand-card border border-violet-500/30 rounded-2xl p-6 flex flex-col"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-400 font-bold text-sm">✓ Answer</span>
            </div>
            <p className="text-emerald-300 font-semibold text-sm mb-3">
              {question.options[question.correct]}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed flex-1">
              {question.explanation}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setFlipped(f => !f)}
          className="flex-1 bg-brand-card border border-white/10 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
        >
          {flipped ? '← Show Question' : 'Show Answer →'}
        </button>
        <button
          onClick={() => masterFlashcard(question.id)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            mastered
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-white/10 text-slate-300 border border-white/10 hover:bg-white/15'
          }`}
        >
          {mastered ? '✓ Known' : 'Mark Known'}
        </button>
      </div>
    </div>
  )
}
