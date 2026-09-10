export interface Card {
  id: number
  name: string
  type: string | null
  atk: number | null
  def: number | null
  attribute?: string | null
  level?: number | null
  guardianStar1?: string | null
  guardianStar2?: string | null
  password?: string | null
  cost?: number | null
  description?: string | null
  hasEffect?: boolean | null
  color?: number | null
}

export interface Duelist {
  id: number
  name: string
  slug: string
}

export const DROP_RANKS = ['SA_POW', 'BCD', 'SA_TEC'] as const
export type DropRank = (typeof DROP_RANKS)[number]

export interface Drop {
  duelistId: number
  cardId: number
  rank: DropRank
  weight: number
  condition?: string
  denominator?: number
}

export type RewardCount = 1 | 5 | 10 | 15
export type DropSort = 'rate' | 'name' | 'id' | 'atk'
export type CardTypeFilter = 'all' | 'monsters' | 'magic' | 'trap'
