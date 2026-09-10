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
  it('handles an empty mod dataset', () => {
    const emptyData = createDataLookup(fm2Ghost)
    expect(emptyData.cards).toEqual([])
    expect(emptyData.getCardById(337)).toBeUndefined()
    expect(emptyData.getDropsForCard(337)).toEqual([])
  })
  it('sorts card drops by descending weight', () => {
    const lower = { card: data.getCardById(337)!, drop: { duelistId: 1, cardId: 337, rank: 'SA_TEC' as const, weight: 40 } }
    const higher = { card: data.getCardById(1)!, drop: { duelistId: 1, cardId: 1, rank: 'SA_POW' as const, weight: 52 } }
    expect(data.sortCardDropRows([lower, higher], 'rate').map((row) => row.drop.weight)).toEqual([52, 40])
  })
})
