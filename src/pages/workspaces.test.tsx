// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { RewardCountProvider } from '../context/RewardCountProvider'
import { CardsPage } from './CardsPage'
import { DuelistsPage } from './DuelistsPage'

function LocationProbe() {
  const location = useLocation()
  return <output data-testid="location">{location.pathname}{location.search}</output>
}

function renderWorkspace(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <RewardCountProvider>
        <Routes>
          <Route path="/cards/:cardId?" element={<CardsPage />} />
          <Route path="/duelists/:duelistSlug?" element={<DuelistsPage />} />
        </Routes>
        <LocationProbe />
      </RewardCountProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(cleanup)

describe('Cards workspace', () => {
  it('renders the catalog and restrained empty detail at /cards', () => {
    renderWorkspace('/cards')
    expect(screen.getByRole('complementary', { name: 'Card catalog' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Card details' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Select a card' })).toBeTruthy()
  })

  it('keeps search state while selection updates the URL and selected row', async () => {
    const user = userEvent.setup()
    renderWorkspace('/cards')
    const catalog = screen.getByRole('complementary', { name: 'Card catalog' })
    const search = screen.getByRole('searchbox', { name: 'Search cards' })
    await user.type(search, 'raigeki')
    const raigekiLink = within(catalog).getByRole('link', { name: /Raigeki/ })
    await user.click(raigekiLink)

    expect(screen.getByTestId('location').textContent).toBe('/cards/337')
    expect((search as HTMLInputElement).value).toBe('raigeki')
    expect(raigekiLink.getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('heading', { name: 'Raigeki', level: 1 })).toBeTruthy()
  })

  it('initializes catalog selection and detail from a deep link', () => {
    renderWorkspace('/cards/337')
    const catalog = screen.getByRole('complementary', { name: 'Card catalog' })
    expect(within(catalog).getByRole('link', { name: /Raigeki/ }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('heading', { name: 'Raigeki', level: 1 })).toBeTruthy()
  })
})

describe('Duelists workspace', () => {
  it('renders the catalog and restrained empty detail at /duelists', () => {
    renderWorkspace('/duelists')
    expect(screen.getByRole('complementary', { name: 'Duelist catalog' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Duelist details' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Select a duelist' })).toBeTruthy()
  })

  it('preserves catalog search while selecting a duelist', async () => {
    const user = userEvent.setup()
    renderWorkspace('/duelists')
    const catalog = screen.getByRole('complementary', { name: 'Duelist catalog' })
    const search = screen.getByRole('searchbox', { name: 'Search duelists' })
    await user.type(search, 'seto 2nd')
    const setoLink = within(catalog).getByRole('link', { name: /Seto 2nd/ })
    await user.click(setoLink)

    expect(screen.getByTestId('location').textContent).toBe('/duelists/seto-2nd')
    expect((search as HTMLInputElement).value).toBe('seto 2nd')
    expect(setoLink.getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('heading', { name: 'Seto 2nd', level: 1 })).toBeTruthy()
  })

  it('initializes catalog selection and detail from a deep link', () => {
    renderWorkspace('/duelists/seto-2nd')
    const catalog = screen.getByRole('complementary', { name: 'Duelist catalog' })
    expect(within(catalog).getByRole('link', { name: /Seto 2nd/ }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('heading', { name: 'Seto 2nd', level: 1 })).toBeTruthy()
  })

  it('honors and preserves the selected rank query between duelists', async () => {
    const user = userEvent.setup()
    renderWorkspace('/duelists/seto-2nd?rank=SA_TEC')
    expect(screen.getByRole('tab', { name: 'S/A TEC' }).getAttribute('aria-selected')).toBe('true')

    const search = screen.getByRole('searchbox', { name: 'Search duelists' })
    await user.type(search, 'pegasus')
    await user.click(screen.getByRole('link', { name: /Pegasus/ }))
    expect(screen.getByTestId('location').textContent).toBe('/duelists/pegasus?rank=SA_TEC')
    expect((search as HTMLInputElement).value).toBe('pegasus')
    expect(screen.getByRole('tab', { name: 'S/A TEC' }).getAttribute('aria-selected')).toBe('true')
  })
})
