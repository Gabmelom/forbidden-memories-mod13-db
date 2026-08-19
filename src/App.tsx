import { Navigate, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { RewardCountProvider } from './context/RewardCountProvider'
import { CardsPage } from './pages/CardsPage'
import { DuelistsPage } from './pages/DuelistsPage'

export default function App() {
  return (
    <RewardCountProvider>
      <AppHeader />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/cards" replace />} />
          <Route path="/cards/:cardId?" element={<CardsPage />} />
          <Route path="/duelists/:duelistSlug?" element={<DuelistsPage />} />
          <Route path="*" element={<Navigate to="/cards" replace />} />
        </Routes>
      </main>
    </RewardCountProvider>
  )
}
