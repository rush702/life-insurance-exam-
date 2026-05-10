import { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../hooks/useQuiz'
import { useTimer } from '../hooks/useTimer'
import { getExamQuestions } from '../data/questions'
import { TimerDisplay } from '../components/quiz/TimerDisplay'
import { ProgressBar } from '../components/quiz/ProgressBar'
import { AnswerOption } from '../components/quiz/AnswerOption'
import { useGameStore } from '../store/useGameStore'

const EXAM_SECONDS = 60 * 60 // 60 minutes

export function ExamPage() {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const questions = useMemo(() => getExamQuestions(), [])
  const quiz = useQuiz(questions, 'exam')
  const { saveSession, addXP } = useGameStore()

  const { formattedTime, isWarning, isCritical, isExpired } = useTimer(
    EXAM_SECONDS,
    () => handleSubmit()
  )

  const handleSubmit = () => {
    const session = quiz.getSession()
    const pct = session.answers.length > 0
      ? Math.round((session.answers.filter(a => a.isCorrect).length / session.questions.length) * 100)
      : 0
    if (pct >= 70) addXP(50) // exam pass bonus
    saveSession(session)
    navigate('/results', { state: { session, examMode: true } })
  }

  useEffect(() => {
    if (quiz.phase === 'complete') {
      handleSubmit()
    }
  }, [quiz.phase]) // eslint-disable-line

  // Exam mode: no feedback shown during quiz
  // When user clicks an answer, just advance to next
  const handleExamAnswer = (idx: number) => {
    quiz.handleAnswer(idx)
    // Auto-advance after brief moment
    setTimeout(() => quiz.handleNext(), 300)
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="text-5xl">📝</div>
        <h1 className="font-display font-bold text-2xl text-white">Exam Simulation</h1>
        <p className="text-slate-400 leading-relaxed">
          50 questions · 60-minute time limit<br />
          No feedback until the end · 70% to pass<br />
          Mirrors the real AZ licensing exam
        </p>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
          ⚠️ Answers are final — no going back. Answer all questions and submit when done or let the timer expire.
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setStarted(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-colors"
        >
          Start Exam ⏱
        </motion.button>
        <button onClick={() => navigate('/')} className="block mx-auto text-slate-500 hover:text-slate-300 text-sm transition-colors">
          ← Back to home
        </button>
      </div>
    )
  }

  if (isExpired) return null

  const currentQ = quiz.currentQuestion
  if (!currentQ) return null

  const answeredCount = quiz.answers.length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Exam header */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar
            current={quiz.currentIndex}
            total={quiz.questions.length}
            correct={quiz.answers.filter(a => a.isCorrect).length}
          />
        </div>
        <TimerDisplay formattedTime={formattedTime} isWarning={isWarning} isCritical={isCritical} />
      </div>

      {/* Question — no feedback in exam mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-brand-card rounded-2xl p-5 border border-white/10">
            <p className="text-white font-medium text-base leading-relaxed">{currentQ.question}</p>
          </div>
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const answered = quiz.answers.find(a => a.questionId === currentQ.id)
              const status = answered
                ? idx === answered.selectedIndex ? 'selected' : 'default'
                : quiz.phase === 'feedback' ? (idx === quiz.selectedIndex ? 'selected' : 'default') : 'default'
              return (
                <AnswerOption
                  key={idx}
                  index={idx}
                  text={opt}
                  status={status as any}
                  disabled={quiz.phase === 'feedback' || !!answered}
                  onClick={() => handleExamAnswer(idx)}
                />
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Submit button */}
      {answeredCount >= Math.floor(questions.length * 0.5) && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Submit Exam ({answeredCount}/{questions.length} answered)
        </motion.button>
      )}
    </div>
  )
}
