import { describe, expect, it } from 'vitest'
import { getCardById, getDuelistBySlug, sortCardDropRows } from './dataLookup'

describe('data lookups', () => {
  it('finds cards by ID', () => expect(getCardById(337)?.name).toBe('Raigeki'))
  it('finds duelists by slug', () => expect(getDuelistBySlug('seto-2nd')?.id).toBe(32))
  it('sorts card drops by descending weight', () => {
    const lower = { card: getCardById(337)!, drop: { duelistId: 1, cardId: 337, rank: 'SA_TEC' as const, weight: 40 } }
    const higher = { card: getCardById(1)!, drop: { duelistId: 1, cardId: 1, rank: 'SA_POW' as const, weight: 52 } }
    expect(sortCardDropRows([lower, higher], 'rate').map((row) => row.drop.weight)).toEqual([52, 40])
  })
})
