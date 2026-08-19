import { describe, expect, it } from 'vitest'
import type { Card } from '../types'
import {
  EMPTY_ADVANCED_CARD_FILTERS,
  type CardAdvancedFilters,
  countActiveAdvancedFilters,
  filterCards,
  matchesAdvancedFilters,
} from './cardFilters'

const cards: Card[] = [
  { id: 1, name: 'Blue-eyes White Dragon', type: 'Dragon', atk: 3000, def: 2500, attribute: 'Light', level: 8, guardianStar1: 'Sun', guardianStar2: 'Mars' },
  { id: 2, name: 'Dark Dragon', type: 'Dragon', atk: 2200, def: 2000, attribute: 'Dark', level: 6, guardianStar1: 'Moon', guardianStar2: 'Mars' },
  { id: 3, name: 'Zero Wall', type: 'Rock', atk: 0, def: 3000, attribute: 'Earth', level: 4, guardianStar1: 'Uranus', guardianStar2: 'Saturn' },
  { id: 4, name: 'Dark Fiend', type: 'Fiend', atk: 2400, def: 0, attribute: 'Dark', level: 7, guardianStar1: 'Pluto', guardianStar2: 'Mercury' },
  { id: 5, name: 'Magic Test', type: 'Magic', atk: null, def: null, attribute: null, level: null, guardianStar1: null, guardianStar2: null },
]

function advanced(changes: Partial<CardAdvancedFilters>): CardAdvancedFilters {
  return { ...EMPTY_ADVANCED_CARD_FILTERS, ...changes }
}

describe('advanced card filters', () => {
  it('applies an inclusive minimum ATK and excludes null ATK', () => {
    const filters = advanced({ minAtk: 2500 })
    expect(matchesAdvancedFilters(cards[0], filters)).toBe(true)
    expect(matchesAdvancedFilters(cards[1], filters)).toBe(false)
    expect(matchesAdvancedFilters(cards[4], filters)).toBe(false)
  })

  it('allows a real zero ATK without treating null ATK as zero', () => {
    const filters = advanced({ maxAtk: 0 })
    expect(matchesAdvancedFilters(cards[2], filters)).toBe(true)
    expect(matchesAdvancedFilters(cards[4], filters)).toBe(false)
  })

  it('applies inclusive ATK and DEF ranges', () => {
    expect(matchesAdvancedFilters(cards[1], advanced({ minAtk: 2000, maxAtk: 2500 }))).toBe(true)
    expect(matchesAdvancedFilters(cards[0], advanced({ minAtk: 2000, maxAtk: 2500 }))).toBe(false)
    expect(matchesAdvancedFilters(cards[3], advanced({ minDef: 0, maxDef: 0 }))).toBe(true)
    expect(matchesAdvancedFilters(cards[4], advanced({ maxDef: 0 }))).toBe(false)
  })

  it('matches normalized attributes exactly', () => {
    expect(matchesAdvancedFilters(cards[1], advanced({ attribute: 'dark' }))).toBe(true)
    expect(matchesAdvancedFilters(cards[0], advanced({ attribute: 'Dark' }))).toBe(false)
  })

  it('applies an inclusive level range and excludes missing levels', () => {
    const filters = advanced({ minLevel: 6, maxLevel: 7 })
    expect(matchesAdvancedFilters(cards[1], filters)).toBe(true)
    expect(matchesAdvancedFilters(cards[0], filters)).toBe(false)
    expect(matchesAdvancedFilters(cards[4], filters)).toBe(false)
  })

  it('matches a guardian star in either slot', () => {
    const mars = advanced({ guardianStar: 'Mars' })
    expect(matchesAdvancedFilters(cards[0], mars)).toBe(true)
    expect(matchesAdvancedFilters(cards[1], mars)).toBe(true)
    expect(matchesAdvancedFilters(cards[2], mars)).toBe(false)
  })

  it('combines search, exact card type, and advanced filters with AND', () => {
    const results = filterCards(cards, {
      search: 'dragon',
      type: 'Dragon',
      advanced: advanced({ attribute: 'Dark', minAtk: 2000, guardianStar: 'Mars' }),
    })
    expect(results.map((card) => card.id)).toEqual([2])
  })

  it('does not apply an invalid range until it is corrected', () => {
    expect(matchesAdvancedFilters(cards[2], advanced({ minAtk: 2500, maxAtk: 1000 }))).toBe(true)
  })

  it('counts range bounds as one active category', () => {
    expect(countActiveAdvancedFilters(advanced({ attribute: 'Dark', minAtk: 2000, maxAtk: 2500, guardianStar: 'Mars' }))).toBe(3)
  })

  it('restores the full card set when advanced filters are reset', () => {
    const filtered = filterCards(cards, { search: '', type: 'all', advanced: advanced({ minAtk: 2500 }) })
    const reset = filterCards(cards, { search: '', type: 'all', advanced: { ...EMPTY_ADVANCED_CARD_FILTERS } })
    expect(filtered).toHaveLength(1)
    expect(reset).toHaveLength(cards.length)
  })
})
