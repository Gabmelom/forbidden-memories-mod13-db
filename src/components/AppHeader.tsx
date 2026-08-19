import { NavLink } from 'react-router-dom'
import { RewardCountSelector } from './RewardCountSelector'

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-block">
          <NavLink className="brand" to="/cards">FM Mod 13 DB</NavLink>
          <span className="subtitle">Card drops and farming lookup for Mod 13</span>
        </div>
        <nav aria-label="Primary navigation">
          <NavLink to="/cards" className={({ isActive }) => isActive ? 'active' : ''}>Cards</NavLink>
          <NavLink to="/duelists" className={({ isActive }) => isActive ? 'active' : ''}>Duelists</NavLink>
        </nav>
        <RewardCountSelector />
      </div>
    </header>
  )
}
