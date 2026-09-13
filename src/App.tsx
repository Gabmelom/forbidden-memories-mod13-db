import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { useMod } from './context/ModContext'
import { ModProvider } from './context/ModProvider'
import { RewardCountProvider } from './context/RewardCountProvider'
import { DEFAULT_MOD_ID, getMod } from './mods/registry'
import { CardsPage } from './pages/CardsPage'
import { DuelistsPage } from './pages/DuelistsPage'
import { TecTrackerPage } from './pages/TecTrackerPage'

function ModLayout() {
  const { modId } = useParams()
  const mod = getMod(modId)
  if (!mod) return <Navigate to={`/${DEFAULT_MOD_ID}/cards`} replace />

  return (
    <ModProvider mod={mod}>
      <AppHeader />
      <main className="page-shell"><Outlet /></main>
    </ModProvider>
  )
}

function ModDefaultRoute() {
  const { mod } = useMod()
  return <Navigate to={`/${mod.id}/cards`} replace />
}

export default function App() {
  return (
    <RewardCountProvider>
      <Routes>
        <Route path="/" element={<Navigate to={`/${DEFAULT_MOD_ID}/cards`} replace />} />
        <Route path="/:modId" element={<ModLayout />}>
          <Route index element={<ModDefaultRoute />} />
          <Route path="cards/:cardId?" element={<CardsPage />} />
          <Route path="duelists/:duelistSlug?" element={<DuelistsPage />} />
          <Route path="tec-tracker" element={<TecTrackerPage />} />
          <Route path="*" element={<ModDefaultRoute />} />
        </Route>
        <Route path="*" element={<Navigate to={`/${DEFAULT_MOD_ID}/cards`} replace />} />
      </Routes>
    </RewardCountProvider>
  )
}
