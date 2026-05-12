import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { HomePage } from './pages/HomePage'
import { QuizPage } from './pages/QuizPage'
import { ExamPage } from './pages/ExamPage'
import { ResultsPage } from './pages/ResultsPage'
import { ReviewPage } from './pages/ReviewPage'
import { FlashcardsPage } from './pages/FlashcardsPage'

function AppShell() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Header />
      <main className="flex-1 pb-8">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/life-insurance-exam-/">
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="exam" element={<ExamPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="flashcards" element={<FlashcardsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
