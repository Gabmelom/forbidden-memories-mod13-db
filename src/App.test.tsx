// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
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
    expect(screen.getAllByText('ATK 3000 / DEF 2500').length).toBeGreaterThan(0)
    const information = screen.getByRole('region', { name: 'Card information' })
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
  }, 10_000)

  it('loads Ghost duelist artwork from a slug-based path', () => {
    renderApp('/fm2-ghost/duelists/simon-muran')
    expect(screen.getByRole('heading', { name: 'Simon Muran', level: 1 })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Simon Muran' }).getAttribute('src')).toBe('/mods/fm2-ghost/duelists/simon-muran.webp')
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

  it('keeps detail assets and cross-links inside the active mod', () => {
    renderApp('/mod13/cards/337')
    expect(screen.getByRole('img', { name: 'Raigeki' }).getAttribute('src')).toBe('/mods/mod13/cards/337.webp')
    const heishinLink = screen.getByRole('link', { name: /Heishin/ })
    expect(heishinLink.getAttribute('href')).toBe('/mod13/duelists/heishin?rank=SA_TEC')
    expect(heishinLink.querySelector('img')?.getAttribute('src')).toBe('/mods/mod13/duelists/heishin.webp')
  }, 10_000)
})
