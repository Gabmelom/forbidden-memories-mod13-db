import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useMod } from '../context/ModContext'
import { MODS } from '../mods/registry'
import { RewardCountSelector } from './RewardCountSelector'

export function AppHeader() {
  const { mod } = useMod()
  const location = useLocation()
  const navigate = useNavigate()
  const routeSection = location.pathname.split('/')[2]
  const section = routeSection === 'duelists' || routeSection === 'tec-tracker' ? routeSection : 'cards'
  const switchMod = (modId: string) => navigate(`/${modId}/${section}`)

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-block">
          <div className="brand-title-row">
            <NavLink className="brand" to={`/${mod.id}/cards`}>{mod.title}</NavLink>
            <label className="mod-selector">
              <span className="sr-only">Database</span>
              <select aria-label="Database" value={mod.id} onChange={(event) => switchMod(event.target.value)}>
                {MODS.map((availableMod) => <option key={availableMod.id} value={availableMod.id}>{availableMod.label}</option>)}
              </select>
            </label>
          </div>
          <span className="subtitle">{mod.subtitle}</span>
        </div>
        <nav aria-label="Primary navigation">
          <NavLink to={`/${mod.id}/cards`} className={({ isActive }) => isActive ? 'active' : ''}>Cards</NavLink>
          <NavLink to={`/${mod.id}/duelists`} className={({ isActive }) => isActive ? 'active' : ''}>Duelists</NavLink>
          <NavLink to={`/${mod.id}/tec-tracker`} className={({ isActive }) => isActive ? 'active' : ''}>TEC Tracker</NavLink>
        </nav>
        <RewardCountSelector />
      </div>
    </header>
  )
}
