import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { QUESTIONS, getByCategory } from '../data/questions'
import { CATEGORIES } from '../data/categories'
import { FlashCard } from '../components/flashcards/FlashCard'
import { useGameStore } from '../store/useGameStore'
import type { Category } from '../types'

export function FlashcardsPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const { masteredFlashcardIds } = useGameStore()

  const allQuestions = selectedCategory === 'all'
    ? QUESTIONS
    : getByCategory(selectedCategory)

  const unmasteredQuestions = allQuestions.filter(q => !masteredFlashcardIds.includes(q.id))
  const masteredCount = allQuestions.length - unmasteredQuestions.length

  const questions = unmasteredQuestions.length > 0 ? unmasteredQuestions : allQuestions

  const safeIndex = Math.min(currentIndex, questions.length - 1)
  const question = questions[safeIndex]

  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1))
  const handleNext = () => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))

  const handleCategoryChange = (cat: Category | 'all') => {
    setSelectedCategory(cat)
    setCurrentIndex(0)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          ← Home
        </button>
        <div>
          <h1 className="font-display font-bold text-lg text-white">🃏 Flashcards</h1>
        </div>
        {masteredCount > 0 && (
          <div className="ml-auto text-xs text-emerald-400 font-semibold">
            {masteredCount} mastered ✓
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            selectedCategory === 'all'
              ? 'bg-violet-600 border-violet-500 text-white'
              : 'bg-brand-card border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          All ({QUESTIONS.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = getByCategory(cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-brand-card border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Mastery progress */}
      {masteredCount > 0 && (
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Mastered</span>
            <span>{masteredCount}/{allQuestions.length}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              animate={{ width: `${(masteredCount / allQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Flash card */}
      <AnimatePresence mode="wait">
        {question && (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            <FlashCard
              question={question}
              index={safeIndex}
              total={questions.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePrev}
          disabled={safeIndex === 0}
          className="flex-1 bg-brand-card border border-white/10 text-white py-3 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </motion.button>
        <span className="text-slate-500 text-xs w-16 text-center flex-shrink-0">
          {safeIndex + 1} / {questions.length}
        </span>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={safeIndex >= questions.length - 1}
          className="flex-1 bg-brand-card border border-white/10 text-white py-3 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </motion.button>
      </div>

      {unmasteredQuestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center"
        >
          <div className="text-2xl mb-2">🏆</div>
          <p className="text-emerald-400 font-semibold text-sm">All cards mastered!</p>
          <p className="text-slate-500 text-xs mt-1">Showing all {allQuestions.length} cards for review</p>
        </motion.div>
      )}
    </div>
  )
}
