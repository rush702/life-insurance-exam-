import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { GameState, QuizSession, QuestionHistory } from '../types'

interface GameStore extends GameState {
  addXP: (amount: number) => { leveledUp: boolean }
  recordAnswer: (questionId: string, isCorrect: boolean) => void
  incrementStreak: () => void
  resetStreak: () => void
  addWrongAnswer: (questionId: string) => void
  removeWrongAnswer: (questionId: string) => void
  unlockBadge: (badgeId: string) => boolean
  saveSession: (session: QuizSession) => void
  masterFlashcard: (id: string) => void
  resetAll: () => void
}

const initialState: GameState = {
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  questionsAnswered: 0,
  questionsCorrect: 0,
  questionHistory: {},
  earnedBadges: [],
  wrongAnswerIds: [],
  lastSession: null,
  masteredFlashcardIds: [],
}

// XP thresholds for level detection (used for level-up events)
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 3000]

const getLevel = (xp: number) => LEVEL_THRESHOLDS.findIndex((t, i) => {
  const next = LEVEL_THRESHOLDS[i + 1]
  return xp >= t && (next === undefined || xp < next)
})

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXP: (amount) => {
        const prevXP = get().totalXP
        const newXP = prevXP + amount
        const leveledUp = getLevel(newXP) > getLevel(prevXP)
        set({ totalXP: newXP })
        return { leveledUp }
      },

      recordAnswer: (questionId, isCorrect) =>
        set(state => {
          const prev: QuestionHistory = state.questionHistory[questionId] ?? {
            timesCorrect: 0,
            timesWrong: 0,
            lastSeenAt: 0,
          }
          return {
            questionsAnswered: state.questionsAnswered + 1,
            questionsCorrect: state.questionsCorrect + (isCorrect ? 1 : 0),
            questionHistory: {
              ...state.questionHistory,
              [questionId]: {
                timesCorrect: prev.timesCorrect + (isCorrect ? 1 : 0),
                timesWrong: prev.timesWrong + (isCorrect ? 0 : 1),
                lastSeenAt: Date.now(),
              },
            },
          }
        }),

      incrementStreak: () =>
        set(state => {
          const newStreak = state.currentStreak + 1
          return {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
          }
        }),

      resetStreak: () => set({ currentStreak: 0 }),

      addWrongAnswer: (questionId) =>
        set(state => ({
          wrongAnswerIds: state.wrongAnswerIds.includes(questionId)
            ? state.wrongAnswerIds
            : [...state.wrongAnswerIds, questionId],
        })),

      removeWrongAnswer: (questionId) =>
        set(state => ({
          wrongAnswerIds: state.wrongAnswerIds.filter(id => id !== questionId),
        })),

      unlockBadge: (badgeId) => {
        const { earnedBadges } = get()
        if (earnedBadges.includes(badgeId)) return false
        set(state => ({ earnedBadges: [...state.earnedBadges, badgeId] }))
        return true
      },

      saveSession: (session) => set({ lastSession: session }),

      masterFlashcard: (id) =>
        set(state => ({
          masteredFlashcardIds: state.masteredFlashcardIds.includes(id)
            ? state.masteredFlashcardIds
            : [...state.masteredFlashcardIds, id],
        })),

      resetAll: () => set(initialState),
    }),
    {
      name: 'az-exam-prep-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
