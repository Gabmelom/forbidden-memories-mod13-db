// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
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
    const brand = document.querySelector('.brand')
    const modSelector = document.querySelector('.mod-selector select')
    expect(brand?.parentElement?.querySelector('select')).toBe(modSelector)
  })

  it('falls back safely when the mod ID is unknown', () => {
    renderApp('/not-a-mod/duelists/example')
    expect(screen.getByTestId('location').textContent).toBe('/mod13/cards')
  })

  it('loads imported Ghost card metadata from a deep link', () => {
    renderApp('/fm2-ghost/cards/1')
    expect(screen.getByRole('heading', { name: 'Blue-eyes White Dragon', level: 1 })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Blue-eyes White Dragon' }).getAttribute('src')).toBe('/mods/fm2-ghost/cards/001.webp')
    const information = screen.getByRole('region', { name: 'Card information' })
    expect(within(information).getByText('3000')).toBeTruthy()
    expect(within(information).getByText('2500')).toBeTruthy()
    expect(within(information).getByText('Dragon')).toBeTruthy()
    expect(information.querySelector('.card-type-icon')?.getAttribute('src')).toBe('/types/Dragon.png')
    expect(within(information).getByText('Sun')).toBeTruthy()
    expect(within(information).getByText('Mars')).toBeTruthy()
    expect(Array.from(information.querySelectorAll('.guardian-star-icon'), (icon) => icon.getAttribute('src'))).toEqual([
      '/guardian_stars/sun.png',
      '/guardian_stars/mars.png',
    ])
    expect(information.querySelector('.guardian-star-separator')).toBeNull()
    expect(information.querySelector('.card-fact-icon-sword')).toBeTruthy()
    expect(information.querySelector('.card-fact-icon-shield')).toBeTruthy()
    expect(information.querySelector('.card-fact-icon-store')).toBeTruthy()
    expect(information.querySelector('.card-fact-icon-starchip')?.getAttribute('src')).toBe('/misc/starchip.png')
    expect(within(information).getByText('65814155')).toBeTruthy()
    expect(within(information).getByText('14,604')).toBeTruthy()
    expect(within(information).getByText('[Ritual] - An extremely rare card with unsurpassed attack and defense power.')).toBeTruthy()
    const equips = screen.getByRole('region', { name: 'Equips' })
    expect(within(equips).getByRole('link', { name: /Dragon Treasure/ })).toBeTruthy()
    expect(within(equips).getAllByRole('link')).toHaveLength(6)
    const fusions = screen.getByRole('region', { name: 'Fusions' })
    expect(within(fusions).getByRole('heading', { name: 'Used to form other cards' })).toBeTruthy()
    expect(within(fusions).getByRole('link', { name: /Doomkaiser Dragon/ })).toBeTruthy()
    expect(within(fusions).getByRole('link', { name: /Berserk Dragon/ })).toBeTruthy()
  }, 10_000)

  it('loads Ghost duelist artwork from a slug-based path', () => {
    renderApp('/fm2-ghost/duelists/simon-muran')
    expect(screen.getByRole('heading', { name: 'Simon Muran', level: 1 })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Simon Muran' }).getAttribute('src')).toBe('/mods/fm2-ghost/duelists/simon-muran.webp')
  }, 10_000)

  it('shows normalized Ghost drop requirements as note chips', () => {
    renderApp('/fm2-ghost/cards/698')
    expect(screen.getByRole('columnheader', { name: 'Requirements' })).toBeTruthy()
    expect(screen.getByText('2988 wins')).toBeTruthy()
    expect(screen.getByText('Library')).toBeTruthy()
    expect(screen.getByText('Chest: 50× Light-Imprisoning Mirrors')).toBeTruthy()
    expect(screen.getByText('Chest: no Obelisk the Tormentor')).toBeTruthy()
    expect(screen.queryByText('3000 wins')).toBeNull()
    const rituals = screen.getByRole('region', { name: 'Rituals' })
    expect(within(rituals).getByRole('heading', { name: 'How to form this card' })).toBeTruthy()
    expect(within(rituals).getByRole('heading', { name: 'Used to form other cards' })).toBeTruthy()
    expect(within(rituals).getByRole('link', { name: /Polymerization/ })).toBeTruthy()
    expect(within(rituals).getByRole('link', { name: /Horakhty/ })).toBeTruthy()
  }, 10_000)

  it('shows applicable Ghost fusion rules instead of enumerating every matching card', () => {
    renderApp('/fm2-ghost/cards/24')
    const fusions = screen.getByRole('region', { name: 'Fusions' })
    const rule = fusions.querySelector('[data-rule-id^="type-type-dragon-zombie-dragon-zombie"]') as HTMLElement
    expect(rule).toBeTruthy()
    expect(within(rule).getByText('Dragon')).toBeTruthy()
    expect(within(rule).getByText('Zombie')).toBeTruthy()
    expect(within(rule).getAllByText('ATK < 1600')).toHaveLength(2)
    expect(within(rule).getByRole('link', { name: /Dragon Zombie/ })).toBeTruthy()
    expect(rule.querySelectorAll('.fusion-card-link')).toHaveLength(1)
    expect(rule.querySelector('.fusion-rule-matcher.current')).toBeTruthy()
    expect(Array.from(rule.querySelectorAll('.card-type-icon'), (icon) => icon.getAttribute('src'))).toEqual([
      '/types/Zombie.png',
      '/types/Dragon.png',
    ])
  }, 10_000)

  it('keeps exact Ghost recipes visible as specific fusions', () => {
    renderApp('/fm2-ghost/cards/4')
    const fusions = screen.getByRole('region', { name: 'Fusions' })
    const timeWizard = within(fusions).getAllByRole('link', { name: /Time Wizard/ })[0]
    const recipe = timeWizard.closest('.fusion-specific-card') as HTMLElement
    expect(recipe).toBeTruthy()
    expect(within(recipe).getByText('Specific')).toBeTruthy()
    expect(within(recipe).getByRole('link', { name: /Thousand Dragon/ })).toBeTruthy()
  }, 10_000)

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

  it('provides a manual TEC Tracker for every rank value and resets the duel', async () => {
    const user = userEvent.setup()
    renderApp('/mod13/tec-tracker')

    expect(screen.getByRole('link', { name: 'TEC Tracker' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('heading', { name: 'TEC Tracker', level: 1 })).toBeTruthy()
    const result = screen.getByRole('region', { name: 'Projected duel rank' })
    expect(within(result).getByText('S POW')).toBeTruthy()
    expect(within(result).getByText('101')).toBeTruthy()
    const turnScale = screen.getByLabelText('Turns scoring ranges')
    expect(turnScale.classList.contains('tec-score-scale')).toBe(true)
    expect(turnScale.querySelectorAll('.tec-score-scale-track > span')).toHaveLength(5)
    expect(turnScale.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toMatch(/0.+4 turns: \+12 points/)
    expect(screen.getByRole('slider', { name: 'Set turns' })).toBeTruthy()
    const cardScale = screen.getByLabelText('Cards used scoring ranges')
    expect(cardScale.classList.contains('tec-score-scale')).toBe(true)
    expect(cardScale.querySelectorAll('.tec-score-scale-track > span')).toHaveLength(5)
    expect(Array.from(cardScale.querySelectorAll('.tec-score-scale-axis > span'), (tick) => tick.textContent)).toEqual(['9', '13', '33', '37+'])
    expect(cardScale.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toMatch(/0.+8 cards used: \+15 points/)
    expect(cardScale.querySelector('[aria-current="true"]')?.classList.contains('active')).toBe(true)
    expect(Array.from(cardScale.querySelectorAll('.tec-score-scale-axis > span.active'), (tick) => tick.textContent)).toEqual(['9'])
    const cardSlider = screen.getByRole('slider', { name: 'Set cards used' }) as HTMLInputElement
    expect(cardSlider.value).toBe('0')
    fireEvent.pointerDown(cardSlider)
    fireEvent.change(cardSlider, { target: { value: '8.4' } })
    expect(cardSlider.value).toBe('8.4')
    expect((screen.getByRole('spinbutton', { name: 'Cards used' }) as HTMLInputElement).value).toBe('8')
    fireEvent.pointerUp(cardSlider, { target: { value: '8.4' } })
    expect(cardSlider.value).toBe('8')
    const trapRanges = screen.getByLabelText('Traps triggered scoring ranges')
    expect(trapRanges.querySelectorAll('.tec-score-scale-track > span')).toHaveLength(5)
    expect(trapRanges.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toBe('0 traps triggered: +2 points')
    expect(trapRanges.querySelector('[aria-current="true"] em')?.classList.contains('positive')).toBe(true)
    expect(screen.getByLabelText('Face-down plays scoring ranges').querySelector('[aria-current="true"] em')?.classList.contains('neutral')).toBe(true)

    for (const label of [
      'Turns', 'Cards used', 'Effective attacks', 'Defensive wins', 'Face-down plays',
      'Fusions', 'Equip magic', 'Spell cards', 'Traps triggered', 'Remaining LP',
    ]) {
      expect(screen.getByRole('spinbutton', { name: label })).toBeTruthy()
      expect(screen.getByRole('button', { name: `Increase ${label}` })).toBeTruthy()
      expect(screen.getByRole('button', { name: `Decrease ${label}` })).toBeTruthy()
      expect(screen.getByRole('slider', { name: `Set ${label.toLocaleLowerCase()}` })).toBeTruthy()
    }

    await user.click(screen.getByRole('button', { name: 'Increase Traps triggered' }))
    expect(within(result).getByText('91')).toBeTruthy()
    expect(trapRanges.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toMatch(/1.+2 traps triggered: -8 points/)

    expect(trapRanges.querySelector('[aria-current="true"] em')?.classList.contains('negative')).toBe(true)

    for (let turn = 0; turn < 5; turn += 1) {
      await user.click(screen.getByRole('button', { name: 'Increase Turns' }))
    }
    expect(turnScale.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toMatch(/5.+8 turns: \+8 points/)

    fireEvent.change(cardSlider, { target: { value: '13' } })
    expect((screen.getByRole('spinbutton', { name: 'Cards used' }) as HTMLInputElement).value).toBe('13')
    expect(cardScale.querySelector('[aria-current="true"]')?.getAttribute('aria-label')).toMatch(/13.+32 cards used: \+0 points/)
    expect(Array.from(cardScale.querySelectorAll('.tec-score-scale-axis > span.active'), (tick) => tick.textContent)).toEqual(['13', '33'])

    await user.click(screen.getByRole('button', { name: 'Decrease Remaining LP' }))
    expect((screen.getByRole('spinbutton', { name: 'Remaining LP' }) as HTMLInputElement).value).toBe('7950')

    await user.click(screen.getByRole('button', { name: 'Reset duel' }))
    expect(within(result).getByText('101')).toBeTruthy()
    expect((screen.getByRole('spinbutton', { name: 'Traps triggered' }) as HTMLInputElement).value).toBe('0')
    expect((screen.getByRole('spinbutton', { name: 'Cards used' }) as HTMLInputElement).value).toBe('0')
    expect(cardSlider.value).toBe('0')
    expect((screen.getByRole('spinbutton', { name: 'Remaining LP' }) as HTMLInputElement).value).toBe('8000')
  })

  it('keeps the TEC Tracker selected when switching databases', async () => {
    const user = userEvent.setup()
    renderApp('/mod13/tec-tracker')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Database' }), 'fm2-ghost')
    expect(screen.getByTestId('location').textContent).toBe('/fm2-ghost/tec-tracker')
  })

  it('keeps detail assets and cross-links inside the active mod', () => {
    renderApp('/mod13/cards/337')
    expect(screen.getByRole('img', { name: 'Raigeki' }).getAttribute('src')).toBe('/mods/mod13/cards/337.webp')
    const heishinLink = screen.getByRole('link', { name: /Heishin/ })
    expect(heishinLink.getAttribute('href')).toBe('/mod13/duelists/heishin?rank=SA_TEC')
    expect(heishinLink.querySelector('img')?.getAttribute('src')).toBe('/mods/mod13/duelists/heishin.webp')
  }, 10_000)
})
