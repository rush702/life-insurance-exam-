import { useState, useCallback, useRef } from 'react'
import { useGameStore } from '../store/useGameStore'
import type { Question, UserAnswer, QuizMode, QuizSession, Category } from '../types'

type Phase = 'answering' | 'feedback' | 'complete'

interface QuizState {
  questions: Question[]
  currentIndex: number
  phase: Phase
  selectedIndex: number | null
  feedbackType: 'correct' | 'wrong' | null
  answers: UserAnswer[]
  sessionXP: number
  streakMilestone: number | null
  newBadges: string[]
  leveledUp: boolean
}

interface UseQuizReturn extends QuizState {
  currentQuestion: Question | null
  progress: number
  handleAnswer: (index: number) => void
  handleNext: () => void
  dismissMilestone: () => void
  getSession: () => QuizSession
}

const XP_CORRECT = 10
const XP_WRONG = 2
const STREAK_BONUSES: Record<number, number> = { 3: 5, 5: 10, 10: 25 }
const STREAK_MILESTONES = [3, 5, 10, 15, 20, 25]

const BADGE_CHECKS: Array<{
  id: string
  check: (state: ReturnType<typeof useGameStore.getState>) => boolean
}> = [
  { id: 'first-correct',  check: s => s.questionsCorrect >= 1 },
  { id: 'streak-3',       check: s => s.longestStreak >= 3 },
  { id: 'streak-5',       check: s => s.longestStreak >= 5 },
  { id: 'streak-10',      check: s => s.longestStreak >= 10 },
  { id: 'answered-25',    check: s => s.questionsAnswered >= 25 },
  { id: 'answered-100',   check: s => s.questionsAnswered >= 100 },
  { id: 'xp-100',         check: s => s.totalXP >= 100 },
  { id: 'xp-500',         check: s => s.totalXP >= 500 },
]

export function useQuiz(
  questions: Question[],
  mode: QuizMode,
  category?: Category
): UseQuizReturn {
  const store = useGameStore()

  const [state, setState] = useState<QuizState>({
    questions,
    currentIndex: 0,
    phase: 'answering',
    selectedIndex: null,
    feedbackType: null,
    answers: [],
    sessionXP: 0,
    streakMilestone: null,
    newBadges: [],
    leveledUp: false,
  })

  const answeredRef = useRef(false)

  const handleAnswer = useCallback((selectedIndex: number) => {
    if (state.phase !== 'answering' || answeredRef.current) return
    answeredRef.current = true

    const question = state.questions[state.currentIndex]
    const isCorrect = selectedIndex === question.correct

    // Update store
    store.recordAnswer(question.id, isCorrect)

    let xpGain = isCorrect ? XP_CORRECT : XP_WRONG
    let newStreak = store.currentStreak
    let milestone: number | null = null

    if (isCorrect) {
      store.incrementStreak()
      newStreak = store.currentStreak + 1
      const bonus = STREAK_BONUSES[newStreak] ?? 0
      xpGain += bonus
      if (STREAK_MILESTONES.includes(newStreak)) {
        milestone = newStreak
      }
      store.removeWrongAnswer(question.id)
    } else {
      store.resetStreak()
      newStreak = 0
      store.addWrongAnswer(question.id)
    }

    const { leveledUp } = store.addXP(xpGain)

    // Check badges
    const storeState = useGameStore.getState()
    const newBadges: string[] = []
    for (const badge of BADGE_CHECKS) {
      if (badge.check(storeState)) {
        const unlocked = store.unlockBadge(badge.id)
        if (unlocked) newBadges.push(badge.id)
      }
    }

    const newAnswer: UserAnswer = { questionId: question.id, selectedIndex, isCorrect }

    setState(prev => ({
      ...prev,
      phase: 'feedback',
      selectedIndex,
      feedbackType: isCorrect ? 'correct' : 'wrong',
      answers: [...prev.answers, newAnswer],
      sessionXP: prev.sessionXP + xpGain,
      streakMilestone: milestone,
      newBadges,
      leveledUp,
    }))
  }, [state.phase, state.currentIndex, state.questions, store])

  const handleNext = useCallback(() => {
    answeredRef.current = false
    const isLast = state.currentIndex >= state.questions.length - 1

    if (isLast) {
      setState(prev => ({ ...prev, phase: 'complete', streakMilestone: null }))
    } else {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        phase: 'answering',
        selectedIndex: null,
        feedbackType: null,
        streakMilestone: null,
        newBadges: [],
        leveledUp: false,
      }))
    }
  }, [state.currentIndex, state.questions.length])

  const dismissMilestone = useCallback(() => {
    setState(prev => ({ ...prev, streakMilestone: null }))
  }, [])

  const getSession = useCallback((): QuizSession => ({
    mode,
    category,
    questions: state.questions,
    answers: state.answers,
    xpEarned: state.sessionXP,
    completedAt: Date.now(),
  }), [mode, category, state.questions, state.answers, state.sessionXP])

  return {
    ...state,
    currentQuestion: state.questions[state.currentIndex] ?? null,
    progress: state.questions.length > 0
      ? Math.round((state.currentIndex / state.questions.length) * 100)
      : 0,
    handleAnswer,
    handleNext,
    dismissMilestone,
    getSession,
  }
}
