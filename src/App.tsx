import { Navigate, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { RewardCountProvider } from './context/RewardCountProvider'
import { CardDetailPage } from './pages/CardDetailPage'
import { CardsPage } from './pages/CardsPage'
import { DuelistDetailPage } from './pages/DuelistDetailPage'
import { DuelistsPage } from './pages/DuelistsPage'

export default function App() {
  return (
    <RewardCountProvider>
      <AppHeader />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/cards" replace />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/cards/:cardId" element={<CardDetailPage />} />
          <Route path="/duelists" element={<DuelistsPage />} />
          <Route path="/duelists/:duelistSlug" element={<DuelistDetailPage />} />
          <Route path="*" element={<Navigate to="/cards" replace />} />
        </Routes>
      </main>
    </RewardCountProvider>
  )
}
