export type Difficulty = 'easy' | 'medium' | 'hard'

export type Category =
  | 'life-basics'
  | 'policy-provisions'
  | 'beneficiaries'
  | 'annuities'
  | 'riders'
  | 'az-regulations'
  | 'group-insurance'
  | 'disability-health'
  | 'ethics-licensing'

export interface Question {
  id: string
  question: string
  options: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  explanation: string
  category: Category
  difficulty: Difficulty
}

export type QuizMode = 'quick' | 'category' | 'exam' | 'review'

export interface UserAnswer {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
}

export interface QuizSession {
  mode: QuizMode
  category?: Category
  questions: Question[]
  answers: UserAnswer[]
  xpEarned: number
  completedAt: number
}

export interface QuestionHistory {
  timesCorrect: number
  timesWrong: number
  lastSeenAt: number
}

export interface GameState {
  totalXP: number
  currentStreak: number
  longestStreak: number
  questionsAnswered: number
  questionsCorrect: number
  questionHistory: Record<string, QuestionHistory>
  earnedBadges: string[]
  wrongAnswerIds: string[]
  lastSession: QuizSession | null
  masteredFlashcardIds: string[]
}

export interface CategoryMeta {
  id: Category
  label: string
  icon: string
  gradient: string
  description: string
}

export interface LevelInfo {
  level: number
  name: string
  icon: string
  minXP: number
  maxXP: number
  color: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}
