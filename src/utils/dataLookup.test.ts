import { describe, expect, it } from 'vitest'
import { fm2Ghost } from '../mods/fm2-ghost'
import { mod13 } from '../mods/mod13'
import { createDataLookup } from './dataLookup'

const data = createDataLookup(mod13)

describe('data lookups', () => {
  it('finds cards by ID', () => expect(data.getCardById(337)?.name).toBe('Raigeki'))
  it('finds duelists by slug', () => expect(data.getDuelistBySlug('seto-2nd')?.id).toBe(32))
  it('indexes drops by card, duelist, and rank', () => {
    expect(data.getDropsForCard(337).length).toBeGreaterThan(0)
    expect(data.getDropsForDuelist(32).length).toBeGreaterThan(0)
    expect(data.getDropsForDuelistAndRank(32, 'SA_TEC').every((drop) => drop.rank === 'SA_TEC')).toBe(true)
  })
  it('indexes the imported FM2 Ghost dataset independently', () => {
    const ghostData = createDataLookup(fm2Ghost)
    expect(ghostData.cards).toHaveLength(722)
    expect(ghostData.getCardById(1)?.atk).toBe(3000)
    expect(ghostData.getCardById(1)?.guardianStar1).toBe('Sun')
    expect(ghostData.getCardById(9)).toMatchObject({
      name: 'Chewbone',
      type: 'Zombie',
      atk: 300,
      def: 300,
      guardianStar1: 'Saturn',
      guardianStar2: 'Moon',
      password: '66153667',
      cost: 225,
      description: 'A flimsy horned skeletal monster. It protects graveyards.',
      color: 0,
    })
    expect(ghostData.getDropsForCard(9)).toHaveLength(22)
    expect(ghostData.getDropsForCard(337).length).toBeGreaterThan(0)
    expect(ghostData.cards.filter((card) => ghostData.getDropsForCard(card.id).length === 0)).toEqual([])
    expect(ghostData.getDropsForCard(18)).toContainEqual({
      duelistId: 30,
      cardId: 18,
      rank: 'BCD',
      weight: 2,
      denominator: 2048,
      notes: [{
        type: 'wins',
        label: '401 wins',
        detail: 'Requires at least 401 total wins before this card can drop.',
      }],
    })
    expect(ghostData.getDropsForCard(270)).toContainEqual({
      duelistId: 28,
      cardId: 270,
      rank: 'SA_POW',
      weight: 2,
      denominator: 2048,
      notes: [{
        type: 'wins',
        label: '400 wins',
        detail: 'Requires at least 400 total wins before this card can drop.',
      }],
    })
    expect(ghostData.getDropsForCard(696)[0].notes?.map((note) => note.label)).toEqual([
      'Chest: 1× Obelisk the Tormentor',
      'Chest: 1× Slifer the Sky Dragon',
      'Chest: 1× The Winged Dragon of Ra',
    ])
    expect(ghostData.getDropsForCard(222).every((drop) =>
      drop.notes?.some((note) => note.label === 'Chest: 250× Kuriboh'),
    )).toBe(true)
    expect(ghostData.getDropsForCard(231).every((drop) =>
      drop.notes?.some((note) => note.label === 'Chest: 250× Kiseitai'),
    )).toBe(true)
    expect(ghostData.rituals).toHaveLength(47)
    expect(ghostData.getRitualsForResult(380)).toContainEqual({
      ritualCardId: 695,
      materialCardIds: [1, 1, 1],
      resultCardId: 380,
    })
    expect(ghostData.getRitualsUsingCard(1)).toHaveLength(1)
    expect(ghostData.getRitualsUsingCard(695)).toHaveLength(46)
    expect(ghostData.equips).toHaveLength(604)
    expect(ghostData.getEquipsForCard(1).map((card) => card.id)).toEqual([307, 315, 657, 668, 678, 693])
    expect(ghostData.fusions).toHaveLength(350)
    expect(ghostData.fusions.reduce((total, group) => total + group.materialCardPairs.length, 0)).toBe(18_124)
    expect(ghostData.getFusionsForResult(270)).toContainEqual({
      materialCardIds: [1, 105],
      resultCardId: 270,
    })
    expect(ghostData.getFusionsUsingCard(1)).toEqual([
      { materialCardIds: [1, 313], resultCardId: 173 },
      { materialCardIds: [1, 105], resultCardId: 270 },
      { materialCardIds: [1, 307], resultCardId: 293 },
      { materialCardIds: [1, 668], resultCardId: 293 },
    ])
  })
  it('sorts card drops by descending weight', () => {
    const lower = { card: data.getCardById(337)!, drop: { duelistId: 1, cardId: 337, rank: 'SA_TEC' as const, weight: 40 } }
    const higher = { card: data.getCardById(1)!, drop: { duelistId: 1, cardId: 1, rank: 'SA_POW' as const, weight: 52 } }
    expect(data.sortCardDropRows([lower, higher], 'rate').map((row) => row.drop.weight)).toEqual([52, 40])
  })
})
