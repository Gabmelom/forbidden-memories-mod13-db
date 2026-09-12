// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ModProvider } from '../context/ModProvider'
import { RewardCountProvider } from '../context/RewardCountProvider'
import { mod13 } from '../mods/mod13'
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
        <ModProvider mod={mod13}>
          <Routes>
            <Route path="/:modId/cards/:cardId?" element={<CardsPage />} />
            <Route path="/:modId/duelists/:duelistSlug?" element={<DuelistsPage />} />
          </Routes>
        </ModProvider>
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
    renderWorkspace('/mod13/cards')
    const catalog = screen.getByRole('complementary', { name: 'Card catalog' })
    const results = within(catalog).getByLabelText('Card results')
    const blueEyesLink = within(results).getByRole('link', { name: '#1 Blue-eyes White Dragon' })
    expect(catalog.parentElement?.classList.contains('card-workspace')).toBe(true)
    expect(results.classList.contains('card-catalog-grid')).toBe(true)
    expect(blueEyesLink.classList.contains('card-catalog-tile')).toBe(true)
    expect(blueEyesLink.getAttribute('title')).toBe('#1 Blue-eyes White Dragon')
    expect(within(blueEyesLink).queryByText('Blue-eyes White Dragon')).toBeNull()
    expect(within(blueEyesLink).queryByText('#1')).toBeNull()
    expect(blueEyesLink.querySelector('.card-type-icon')).toBeNull()
    expect(blueEyesLink.querySelector('.card-image-medium')).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Card details' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Select a card' })).toBeTruthy()
  })

  it('keeps search state while selection updates the URL and selected row', async () => {
    const user = userEvent.setup()
    renderWorkspace('/mod13/cards')
    const catalog = screen.getByRole('complementary', { name: 'Card catalog' })
    const search = screen.getByRole('searchbox', { name: 'Search cards' })
    await user.type(search, 'raigeki')
    const raigekiLink = within(catalog).getByRole('link', { name: /Raigeki/ })
    await user.click(raigekiLink)

    expect(screen.getByTestId('location').textContent).toBe('/mod13/cards/337')
    expect((search as HTMLInputElement).value).toBe('raigeki')
    expect(raigekiLink.getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('heading', { name: 'Raigeki', level: 1 })).toBeTruthy()
  })

  it('initializes catalog selection and detail from a deep link', () => {
    renderWorkspace('/mod13/cards/337')
    const catalog = screen.getByRole('complementary', { name: 'Card catalog' })
    expect(within(catalog).getByRole('link', { name: /Raigeki/ }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('heading', { name: 'Raigeki', level: 1 })).toBeTruthy()
  }, 10_000)

  it('starts advanced filters collapsed and exposes dynamic metadata controls', async () => {
    const user = userEvent.setup()
    renderWorkspace('/mod13/cards')
    const toggle = screen.getByRole('button', { name: /Advanced filters/ })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('combobox', { name: 'Attribute' })).toBeNull()

    await user.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('combobox', { name: 'Attribute' })).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Guardian star' })).toBeTruthy()
    expect(screen.getByRole('group', { name: 'ATK' })).toBeTruthy()
    expect(screen.getByRole('group', { name: 'DEF' })).toBeTruthy()
    expect(screen.getByRole('group', { name: 'Level' })).toBeTruthy()
  })

  it('counts advanced categories, removes one chip, and preserves filters on card selection', async () => {
    const user = userEvent.setup()
    renderWorkspace('/mod13/cards')
    const catalog = screen.getByRole('complementary', { name: 'Card catalog' })
    const toggle = screen.getByRole('button', { name: /Advanced filters/ })
    await user.click(toggle)

    await user.selectOptions(screen.getByRole('combobox', { name: 'Attribute' }), 'Light')
    const atkGroup = screen.getByRole('group', { name: 'ATK' })
    const minAtk = within(atkGroup).getByRole('spinbutton', { name: 'Min' })
    const maxAtk = within(atkGroup).getByRole('spinbutton', { name: 'Max' })
    await user.type(minAtk, '2500')
    await user.type(maxAtk, '3500')

    expect(toggle.textContent).toContain('2')
    expect(screen.getByRole('button', { name: 'Remove ATK filter' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Remove ATK filter' }))
    expect((minAtk as HTMLInputElement).value).toBe('')
    expect((maxAtk as HTMLInputElement).value).toBe('')
    expect(toggle.textContent).toContain('1')

    const blueEyesLink = within(catalog).getByRole('link', { name: /Blue-eyes White Dragon/ })
    await user.click(blueEyesLink)
    expect(screen.getByTestId('location').textContent).toBe('/mod13/cards/1')
    expect((screen.getByRole('combobox', { name: 'Attribute' }) as HTMLSelectElement).value).toBe('Light')
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
  })

  it('shows invalid range feedback without applying the invalid range', async () => {
    const user = userEvent.setup()
    renderWorkspace('/mod13/cards')
    await user.click(screen.getByRole('button', { name: /Advanced filters/ }))
    const atkGroup = screen.getByRole('group', { name: 'ATK' })
    await user.type(within(atkGroup).getByRole('spinbutton', { name: 'Min' }), '2500')
    await user.type(within(atkGroup).getByRole('spinbutton', { name: 'Max' }), '1000')
    expect(within(atkGroup).getByText('Minimum cannot be greater than maximum.')).toBeTruthy()
    expect(screen.getByText('722 / 722')).toBeTruthy()
  })

  it('resets only advanced criteria without changing search, type, or sort', async () => {
    const user = userEvent.setup()
    renderWorkspace('/mod13/cards')
    await user.type(screen.getByRole('searchbox', { name: 'Search cards' }), 'dragon')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Type' }), 'Dragon')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort' }), 'name')
    await user.click(screen.getByRole('button', { name: /Advanced filters/ }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Attribute' }), 'Dark')
    await user.click(screen.getByRole('button', { name: 'Reset advanced filters' }))

    expect((screen.getByRole('searchbox', { name: 'Search cards' }) as HTMLInputElement).value).toBe('dragon')
    expect((screen.getByRole('combobox', { name: 'Type' }) as HTMLSelectElement).value).toBe('Dragon')
    expect((screen.getByRole('combobox', { name: 'Sort' }) as HTMLSelectElement).value).toBe('name')
    expect((screen.getByRole('combobox', { name: 'Attribute' }) as HTMLSelectElement).value).toBe('')
  })

  it('clears all catalog filters from the no-results state while preserving sort', async () => {
    const user = userEvent.setup()
    renderWorkspace('/mod13/cards')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort' }), 'name')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Type' }), 'Dragon')
    await user.type(screen.getByRole('searchbox', { name: 'Search cards' }), 'definitely-not-a-card')
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect((screen.getByRole('searchbox', { name: 'Search cards' }) as HTMLInputElement).value).toBe('')
    expect((screen.getByRole('combobox', { name: 'Type' }) as HTMLSelectElement).value).toBe('all')
    expect((screen.getByRole('combobox', { name: 'Sort' }) as HTMLSelectElement).value).toBe('name')
    expect(screen.getByText('722')).toBeTruthy()
  })
})

describe('Duelists workspace', () => {
  it('renders the catalog and restrained empty detail at /duelists', () => {
    renderWorkspace('/mod13/duelists')
    const catalog = screen.getByRole('complementary', { name: 'Duelist catalog' })
    expect(catalog).toBeTruthy()
    expect(catalog.parentElement?.classList.contains('duelist-workspace')).toBe(true)
    expect(within(catalog).getByLabelText('Duelist results').classList.contains('duelist-catalog-grid')).toBe(true)
    expect(within(catalog).getByRole('button', { name: 'Open duelist search' }).getAttribute('aria-expanded')).toBe('false')
    expect(within(catalog).queryByRole('searchbox', { name: 'Search duelists' })).toBeNull()
    expect(screen.getByRole('region', { name: 'Duelist details' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Select a duelist' })).toBeTruthy()
  })

  it('preserves catalog search while selecting a duelist', async () => {
    const user = userEvent.setup()
    renderWorkspace('/mod13/duelists')
    const catalog = screen.getByRole('complementary', { name: 'Duelist catalog' })
    await user.click(within(catalog).getByRole('button', { name: 'Open duelist search' }))
    const search = screen.getByRole('searchbox', { name: 'Search duelists' })
    expect(document.activeElement).toBe(search)
    await user.type(search, 'seto 2nd')
    const setoLink = within(catalog).getByRole('link', { name: /Seto 2nd/ })
    await user.click(setoLink)

    expect(screen.getByTestId('location').textContent).toBe('/mod13/duelists/seto-2nd')
    expect((search as HTMLInputElement).value).toBe('seto 2nd')
    expect(setoLink.getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('heading', { name: 'Seto 2nd', level: 1 })).toBeTruthy()

    await user.click(within(catalog).getByRole('button', { name: 'Close duelist search' }))
    expect(within(catalog).queryByRole('searchbox', { name: 'Search duelists' })).toBeNull()
    expect(within(catalog).getByRole('link', { name: /Simon Muran/ })).toBeTruthy()
  })

  it('initializes catalog selection and detail from a deep link', () => {
    renderWorkspace('/mod13/duelists/seto-2nd')
    const catalog = screen.getByRole('complementary', { name: 'Duelist catalog' })
    expect(within(catalog).getByRole('link', { name: /Seto 2nd/ }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('heading', { name: 'Seto 2nd', level: 1 })).toBeTruthy()
  })

  it('honors and preserves the selected rank query between duelists', async () => {
    const user = userEvent.setup()
    renderWorkspace('/mod13/duelists/seto-2nd?rank=SA_TEC')
    expect(screen.getByRole('tab', { name: 'S/A TEC' }).getAttribute('aria-selected')).toBe('true')

    await user.click(screen.getByRole('button', { name: 'Open duelist search' }))
    const search = screen.getByRole('searchbox', { name: 'Search duelists' })
    await user.type(search, 'pegasus')
    await user.click(screen.getByRole('link', { name: /Pegasus/ }))
    expect(screen.getByTestId('location').textContent).toBe('/mod13/duelists/pegasus?rank=SA_TEC')
    expect((search as HTMLInputElement).value).toBe('pegasus')
    expect(screen.getByRole('tab', { name: 'S/A TEC' }).getAttribute('aria-selected')).toBe('true')
  })

  it('shows card metadata columns and sorts drops from their headers', async () => {
    const user = userEvent.setup()
    renderWorkspace('/mod13/duelists/seto-2nd?rank=SA_POW')
    const detail = screen.getByRole('region', { name: 'Duelist details' })
    const table = within(detail).getByRole('table')
    for (const name of ['Card', 'Type', 'ATK', 'DEF', 'Weight', 'Per duel']) {
      expect(within(table).getByRole('columnheader', { name })).toBeTruthy()
    }
    expect(within(detail).queryByRole('combobox', { name: 'Sort' })).toBeNull()
    expect(within(table).getAllByRole('button')).toHaveLength(6)
    expect(within(table).getByRole('columnheader', { name: 'Weight' }).getAttribute('aria-sort')).toBe('descending')
    expect(within(table).getByRole('columnheader', { name: 'ATK' }).querySelector('.card-fact-icon-sword')).toBeTruthy()
    expect(within(table).getByRole('columnheader', { name: 'DEF' }).querySelector('.card-fact-icon-shield')).toBeTruthy()
    expect(table.querySelector('td[data-label="Type"] .card-type-icon')).toBeTruthy()

    const attackHeader = within(table).getByRole('columnheader', { name: 'ATK' })
    await user.click(within(attackHeader).getByRole('button'))
    expect(attackHeader.getAttribute('aria-sort')).toBe('descending')
    const descendingAttack = Array.from(table.querySelectorAll<HTMLTableCellElement>('td[data-label="ATK"]'))
      .map((cell) => Number(cell.textContent)).filter(Number.isFinite)
    expect(descendingAttack).toEqual([...descendingAttack].sort((left, right) => right - left))

    await user.click(within(attackHeader).getByRole('button'))
    expect(attackHeader.getAttribute('aria-sort')).toBe('ascending')
    const ascendingAttack = Array.from(table.querySelectorAll<HTMLTableCellElement>('td[data-label="ATK"]'))
      .map((cell) => Number(cell.textContent)).filter(Number.isFinite)
    expect(ascendingAttack).toEqual([...ascendingAttack].sort((left, right) => left - right))
  })
})
