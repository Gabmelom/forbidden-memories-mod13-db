// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import App from './App'

function LocationProbe() {
  const location = useLocation()
  return <output data-testid="location">{location.pathname}{location.search}</output>
}

function renderApp(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(cleanup)

describe('mod routing', () => {
  it('redirects the root route to the default Mod 13 cards catalog', () => {
    renderApp('/')
    expect(screen.getByTestId('location').textContent).toBe('/mod13/cards')
    expect(screen.getByRole('heading', { name: 'Cards' })).toBeTruthy()
  })

  it('falls back safely when the mod ID is unknown', () => {
    renderApp('/not-a-mod/duelists/example')
    expect(screen.getByTestId('location').textContent).toBe('/mod13/cards')
  })

  it('shows empty Ghost cards and duelists without crashing', () => {
    const { unmount } = renderApp('/fm2-ghost/cards')
    expect(screen.getAllByText('FM2 Ghost data has not been imported yet.').length).toBeGreaterThan(0)
    unmount()
    renderApp('/fm2-ghost/duelists')
    expect(screen.getAllByText('FM2 Ghost data has not been imported yet.').length).toBeGreaterThan(0)
  })

  it('switches mods from a card detail to the target card catalog', async () => {
    const user = userEvent.setup()
    renderApp('/mod13/cards/337')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Database' }), 'fm2-ghost')
    expect(screen.getByTestId('location').textContent).toBe('/fm2-ghost/cards')
  })

  it('switches mods from a duelist detail to the target duelist catalog', async () => {
    const user = userEvent.setup()
    renderApp('/mod13/duelists/seto-2nd')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Database' }), 'fm2-ghost')
    expect(screen.getByTestId('location').textContent).toBe('/fm2-ghost/duelists')
  })

  it('keeps detail assets and cross-links inside the active mod', () => {
    renderApp('/mod13/cards/337')
    expect(screen.getByRole('img', { name: 'Raigeki' }).getAttribute('src')).toBe('/mods/mod13/cards/337.webp')
    const heishinLink = screen.getByRole('link', { name: /Heishin/ })
    expect(heishinLink.getAttribute('href')).toBe('/mod13/duelists/heishin?rank=SA_TEC')
    expect(heishinLink.querySelector('img')?.getAttribute('src')).toBe('/mods/mod13/duelists/heishin.webp')
  }, 10_000)
})
