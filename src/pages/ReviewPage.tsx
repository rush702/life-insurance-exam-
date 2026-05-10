import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { getQuestionsByIds } from '../data/questions'
import { AnswerOption } from '../components/quiz/AnswerOption'
import { CATEGORIES } from '../data/categories'

export function ReviewPage() {
  const navigate = useNavigate()
  const { wrongAnswerIds, removeWrongAnswer } = useGameStore()
  const questions = getQuestionsByIds(wrongAnswerIds)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [dismissed, setDismissed] = useState<string[]>([])

  const remaining = questions.filter(q => !dismissed.includes(q.id))
  const question = remaining[currentIndex] ?? null

  if (wrongAnswerIds.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="text-6xl">🎯</div>
        <h1 className="font-display font-bold text-2xl text-white">No Wrong Answers!</h1>
        <p className="text-slate-400">You haven't missed any questions yet — or you've reviewed them all. Keep practicing to build this list.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </button>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="text-6xl">🏆</div>
        <h1 className="font-display font-bold text-2xl text-white">Review Complete!</h1>
        <p className="text-slate-400">You've gone through all {questions.length} missed questions.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const catMeta = CATEGORIES.find(c => c.id === question.category)

  const handleAnswer = (idx: number) => {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
  }

  const handleNext = () => {
    const isCorrect = selected === question.correct
    if (isCorrect) {
      removeWrongAnswer(question.id)
      setDismissed(prev => [...prev, question.id])
    }
    setRevealed(false)
    setSelected(null)
    setCurrentIndex(prev =>
      prev < remaining.length - 2 ? prev + 1 : Math.max(0, prev - 1)
    )
  }

  const getStatus = (idx: number) => {
    if (!revealed) return 'default'
    if (idx === question.correct) return 'correct'
    if (idx === selected) return 'wrong'
    return 'default'
  }

  const progress = Math.round(((questions.length - remaining.length) / questions.length) * 100)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          ← Home
        </button>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">
          {questions.length - remaining.length}/{questions.length} cleared
        </span>
      </div>

      <div className="text-center">
        <h2 className="font-display font-bold text-lg text-white">🎯 Wrong Answers Review</h2>
        <p className="text-xs text-slate-500 mt-1">Answer correctly to remove from this list</p>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Category badge */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{catMeta?.icon}</span>
            <span className="text-xs text-slate-400">{catMeta?.label}</span>
            <span className={`ml-auto text-xs font-semibold uppercase tracking-wider ${
              question.difficulty === 'easy' ? 'text-emerald-400' :
              question.difficulty === 'medium' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {question.difficulty}
            </span>
          </div>

          {/* Question text */}
          <div className="bg-brand-card rounded-2xl p-5 border border-rose-500/20">
            <p className="text-white font-medium text-base leading-relaxed">{question.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => (
              <AnswerOption
                key={idx}
                index={idx}
                text={opt}
                status={getStatus(idx)}
                disabled={revealed}
                onClick={() => handleAnswer(idx)}
              />
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-2xl p-4 border ${
                  selected === question.correct
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-rose-500/10 border-rose-500/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {selected === question.correct ? '✅' : '❌'}
                  </span>
                  <div className="flex-1">
                    <div className={`font-bold text-sm mb-1 ${selected === question.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selected === question.correct ? 'Correct! Removed from review list.' : 'Still needs work — will stay in review.'}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-colors"
                  >
                    {remaining.length > 1 ? 'Next →' : 'Finish'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
