import { motion, AnimatePresence } from 'framer-motion'
import type { Question } from '../../types'
import { AnswerOption } from './AnswerOption'
import { CATEGORIES } from '../../data/categories'

interface Props {
  question: Question
  selectedIndex: number | null
  feedbackType: 'correct' | 'wrong' | null
  phase: 'answering' | 'feedback' | 'complete'
  onAnswer: (index: number) => void
  onNext: () => void
  sessionXP: number
}

export function QuestionCard({
  question,
  selectedIndex,
  feedbackType,
  phase,
  onAnswer,
  onNext,
  sessionXP,
}: Props) {
  const catMeta = CATEGORIES.find(c => c.id === question.category)
  const disabled = phase === 'feedback'

  const getOptionStatus = (idx: number) => {
    if (phase === 'answering') return 'default'
    if (idx === question.correct) return 'correct'
    if (idx === selectedIndex && !feedbackType?.startsWith('correct')) return 'wrong'
    return 'default'
  }

  const difficultyColor = {
    easy: 'text-emerald-400',
    medium: 'text-amber-400',
    hard: 'text-rose-400',
  }[question.difficulty]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -60, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="space-y-4"
      >
        {/* Category + difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{catMeta?.icon}</span>
          <span className="text-xs text-slate-400 font-medium">{catMeta?.label}</span>
          <span className={`ml-auto text-xs font-semibold uppercase tracking-wider ${difficultyColor}`}>
            {question.difficulty}
          </span>
        </div>

        {/* Question text */}
        <div className="bg-brand-card rounded-2xl p-5 border border-white/10">
          <p className="text-white font-medium text-base leading-relaxed">{question.question}</p>
        </div>

        {/* Answer options */}
        <div className="space-y-2.5">
          {question.options.map((opt, idx) => (
            <AnswerOption
              key={idx}
              index={idx}
              text={opt}
              status={getOptionStatus(idx)}
              disabled={disabled}
              onClick={() => onAnswer(idx)}
            />
          ))}
        </div>

        {/* Feedback panel */}
        <AnimatePresence>
          {phase === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl p-4 border ${
                feedbackType === 'correct'
                  ? 'bg-emerald-500/10 border-emerald-500/40'
                  : 'bg-rose-500/10 border-rose-500/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">
                  {feedbackType === 'correct' ? '✅' : '❌'}
                </span>
                <div className="flex-1">
                  <div className={`font-bold text-sm mb-1 ${feedbackType === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {feedbackType === 'correct' ? 'Correct!' : 'Not quite…'}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{question.explanation}</p>
                </div>
              </div>

              {/* XP floater */}
              <div className="mt-3 flex items-center justify-between">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-amber-400 font-bold text-sm"
                >
                  +{feedbackType === 'correct' ? 10 : 2} XP • Session: {sessionXP} XP
                </motion.span>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onNext}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-colors"
                >
                  Next →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
