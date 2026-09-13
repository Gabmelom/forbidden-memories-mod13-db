export interface DuelRankStats {
  turns: number
  effectiveAttacks: number
  defensiveWins: number
  faceDowns: number
  fusions: number
  equipMagic: number
  pureMagic: number
  trapsTriggered: number
  cardsUsed: number
  lifePoints: number
}

export type DuelRankStat = keyof DuelRankStats
export type DuelRank = 'S POW' | 'A POW' | 'B POW' | 'C POW' | 'D POW' | 'D TEC' | 'C TEC' | 'B TEC' | 'A TEC' | 'S TEC'

export interface ScoreTier {
  min: number
  max: number
  score: number
}

const MAX = Number.POSITIVE_INFINITY

// Reimplemented from the MIT-licensed FMR Auto-Tracker score calculator:
// https://github.com/seth-rah/FMR-Auto-Tracker
const SCORE_TIERS: Record<DuelRankStat, readonly ScoreTier[]> = {
  turns: [
    { min: 0, max: 4, score: 12 },
    { min: 5, max: 8, score: 8 },
    { min: 9, max: 28, score: 0 },
    { min: 29, max: 32, score: -8 },
    { min: 33, max: MAX, score: -12 },
  ],
  effectiveAttacks: [
    { min: 0, max: 1, score: 4 },
    { min: 2, max: 3, score: 2 },
    { min: 4, max: 9, score: 0 },
    { min: 10, max: 19, score: -2 },
    { min: 20, max: MAX, score: -4 },
  ],
  defensiveWins: [
    { min: 0, max: 1, score: 0 },
    { min: 2, max: 5, score: -10 },
    { min: 6, max: 9, score: -20 },
    { min: 10, max: 14, score: -30 },
    { min: 15, max: MAX, score: -40 },
  ],
  faceDowns: [
    { min: 0, max: 0, score: 0 },
    { min: 1, max: 10, score: -2 },
    { min: 11, max: 20, score: -4 },
    { min: 21, max: 30, score: -6 },
    { min: 31, max: MAX, score: -8 },
  ],
  fusions: [
    { min: 0, max: 0, score: 4 },
    { min: 1, max: 4, score: 0 },
    { min: 5, max: 9, score: -4 },
    { min: 10, max: 14, score: -8 },
    { min: 15, max: MAX, score: -12 },
  ],
  equipMagic: [
    { min: 0, max: 0, score: 4 },
    { min: 1, max: 4, score: 0 },
    { min: 5, max: 9, score: -4 },
    { min: 10, max: 14, score: -8 },
    { min: 15, max: MAX, score: -12 },
  ],
  pureMagic: [
    { min: 0, max: 0, score: 2 },
    { min: 1, max: 3, score: -4 },
    { min: 4, max: 6, score: -8 },
    { min: 7, max: 9, score: -12 },
    { min: 10, max: MAX, score: -16 },
  ],
  trapsTriggered: [
    { min: 0, max: 0, score: 2 },
    { min: 1, max: 2, score: -8 },
    { min: 3, max: 4, score: -16 },
    { min: 5, max: 6, score: -24 },
    { min: 7, max: MAX, score: -32 },
  ],
  cardsUsed: [
    { min: 0, max: 8, score: 15 },
    { min: 9, max: 12, score: 12 },
    { min: 13, max: 32, score: 0 },
    { min: 33, max: 36, score: -5 },
    { min: 37, max: MAX, score: -7 },
  ],
  lifePoints: [
    { min: 8000, max: MAX, score: 6 },
    { min: 7000, max: 7999, score: 4 },
    { min: 1000, max: 6999, score: 0 },
    { min: 100, max: 999, score: -5 },
    { min: 0, max: 99, score: -7 },
  ],
}

export const DEFAULT_DUEL_RANK_STATS: DuelRankStats = {
  turns: 0,
  effectiveAttacks: 0,
  defensiveWins: 0,
  faceDowns: 0,
  fusions: 0,
  equipMagic: 0,
  pureMagic: 0,
  trapsTriggered: 0,
  cardsUsed: 0,
  lifePoints: 8000,
}

export const DUEL_RANK_BASE_SCORE = 52

function evaluateStat(stat: DuelRankStat, value: number) {
  return SCORE_TIERS[stat].find((tier) => value >= tier.min && value <= tier.max)?.score ?? 0
}

export function getDuelRankScoreTiers(stat: DuelRankStat) {
  return SCORE_TIERS[stat]
}

export function getScoreContributions(stats: DuelRankStats): Record<DuelRankStat, number> {
  return {
    turns: evaluateStat('turns', stats.turns),
    effectiveAttacks: evaluateStat('effectiveAttacks', stats.effectiveAttacks),
    defensiveWins: evaluateStat('defensiveWins', stats.defensiveWins),
    faceDowns: evaluateStat('faceDowns', stats.faceDowns),
    fusions: evaluateStat('fusions', stats.fusions),
    equipMagic: evaluateStat('equipMagic', stats.equipMagic),
    pureMagic: evaluateStat('pureMagic', stats.pureMagic),
    trapsTriggered: evaluateStat('trapsTriggered', stats.trapsTriggered),
    cardsUsed: evaluateStat('cardsUsed', stats.cardsUsed),
    lifePoints: evaluateStat('lifePoints', stats.lifePoints),
  }
}

export function calculateDuelRankScore(stats: DuelRankStats) {
  return Object.values(getScoreContributions(stats)).reduce((total, contribution) => total + contribution, DUEL_RANK_BASE_SCORE)
}

export function getDuelRank(score: number): DuelRank {
  if (score >= 90) return 'S POW'
  if (score >= 80) return 'A POW'
  if (score >= 70) return 'B POW'
  if (score >= 60) return 'C POW'
  if (score >= 50) return 'D POW'
  if (score >= 40) return 'D TEC'
  if (score >= 30) return 'C TEC'
  if (score >= 20) return 'B TEC'
  if (score >= 10) return 'A TEC'
  return 'S TEC'
}
