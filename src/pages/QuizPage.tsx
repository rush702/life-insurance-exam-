import { useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuiz } from '../hooks/useQuiz'
import { getRandomQuestions, getByCategory } from '../data/questions'
import { QuestionCard } from '../components/quiz/QuestionCard'
import { ProgressBar } from '../components/quiz/ProgressBar'
import { StreakBanner } from '../components/quiz/StreakBanner'
import { useGameStore } from '../store/useGameStore'
import type { Category, QuizMode } from '../types'

const QUICK_COUNT = 10
const CATEGORY_COUNT = 15

export function QuizPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const mode = (params.get('mode') ?? 'quick') as QuizMode
  const categoryParam = params.get('category') as Category | null

  const questions = useMemo(() => {
    if (mode === 'category' && categoryParam) {
      const pool = getByCategory(categoryParam)
      return [...pool].sort(() => Math.random() - 0.5).slice(0, CATEGORY_COUNT)
    }
    return getRandomQuestions(QUICK_COUNT)
  }, [mode, categoryParam])

  const quiz = useQuiz(questions, mode, categoryParam ?? undefined)
  const { saveSession } = useGameStore()

  useEffect(() => {
    if (quiz.phase === 'complete') {
      const session = quiz.getSession()
      saveSession(session)
      navigate('/results', { state: { session } })
    }
  }, [quiz.phase]) // eslint-disable-line

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-400">No questions available for this category yet.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-violet-400 underline text-sm">
          Go back home
        </button>
      </div>
    )
  }

  const correctCount = quiz.answers.filter(a => a.isCorrect).length

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
        <div className="flex-1">
          <ProgressBar
            current={quiz.currentIndex}
            total={quiz.questions.length}
            correct={correctCount}
          />
        </div>
      </div>

      {/* Streak milestone banner */}
      <StreakBanner
        milestone={quiz.streakMilestone}
        onDismiss={quiz.dismissMilestone}
      />

      {/* Level up toast */}
      {quiz.leveledUp && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl px-4 py-2 text-center text-white font-bold text-sm"
        >
          🎉 LEVEL UP! Keep going!
        </motion.div>
      )}

      {/* Question */}
      {quiz.currentQuestion && (
        <QuestionCard
          question={quiz.currentQuestion}
          selectedIndex={quiz.selectedIndex}
          feedbackType={quiz.feedbackType}
          phase={quiz.phase}
          onAnswer={quiz.handleAnswer}
          onNext={quiz.handleNext}
          sessionXP={quiz.sessionXP}
        />
      )}
    </div>
  )
}
