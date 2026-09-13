import { describe, expect, it } from 'vitest'
import {
  calculateDuelRankScore,
  DEFAULT_DUEL_RANK_STATS,
  getDuelRank,
  getScoreContributions,
} from './duelRank'

describe('duel rank calculator', () => {
  it('starts a duel at the same 101-point S POW score as FMR Auto-Tracker', () => {
    const score = calculateDuelRankScore(DEFAULT_DUEL_RANK_STATS)
    expect(score).toBe(101)
    expect(getDuelRank(score)).toBe('S POW')
  })

  it('applies all ten score contributions at their high-count or low-LP tiers', () => {
    const stats = {
      turns: 33,
      effectiveAttacks: 20,
      defensiveWins: 15,
      faceDowns: 31,
      fusions: 15,
      equipMagic: 15,
      pureMagic: 10,
      trapsTriggered: 7,
      cardsUsed: 37,
      lifePoints: 99,
    }

    expect(getScoreContributions(stats)).toEqual({
      turns: -12,
      effectiveAttacks: -4,
      defensiveWins: -40,
      faceDowns: -8,
      fusions: -12,
      equipMagic: -12,
      pureMagic: -16,
      trapsTriggered: -32,
      cardsUsed: -7,
      lifePoints: -7,
    })
    expect(calculateDuelRankScore(stats)).toBe(-98)
    expect(getDuelRank(-98)).toBe('S TEC')
  })

  it.each([
    [90, 'S POW'], [89, 'A POW'], [80, 'A POW'], [79, 'B POW'],
    [70, 'B POW'], [69, 'C POW'], [60, 'C POW'], [59, 'D POW'],
    [50, 'D POW'], [49, 'D TEC'], [40, 'D TEC'], [39, 'C TEC'],
    [30, 'C TEC'], [29, 'B TEC'], [20, 'B TEC'], [19, 'A TEC'],
    [10, 'A TEC'], [9, 'S TEC'],
  ] as const)('maps a score of %i to %s', (score, rank) => {
    expect(getDuelRank(score)).toBe(rank)
  })
})
