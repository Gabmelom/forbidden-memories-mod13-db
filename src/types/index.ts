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

export interface DropNote {
  type: 'wins' | 'library' | 'chest' | 'status'
  label: string
  detail: string
}

export interface Drop {
  duelistId: number
  cardId: number
  rank: DropRank
  weight: number
  condition?: string
  notes?: DropNote[]
  denominator?: number
}

export interface RitualRecipe {
  ritualCardId: number
  materialCardIds: [number, number, number]
  resultCardId: number
}

export interface EquipCompatibility {
  cardId: number
  equipCardIds: number[]
}

export interface FusionGroup {
  resultCardId: number
  materialCardPairs: [number, number][]
}

export interface FusionRecipe {
  materialCardIds: [number, number]
  resultCardId: number
}

export interface FusionCardMatcher {
  cardId?: number
  type?: string
  minAtkInclusive?: number
  maxAtkExclusive?: number
  minDefInclusive?: number
  maxDefExclusive?: number
  attribute?: string | null
  excludeCardIds?: number[]
}

export interface FusionRule {
  id: string
  kind: 'exact-type' | 'type-type'
  left: FusionCardMatcher
  right: FusionCardMatcher
  resultCardId: number
  source: string
  candidateRuleId?: string
  validatedAgainstTea: boolean
}

export interface SpecificFusionGroup extends FusionGroup {
  source: string
  validatedAgainstTea: boolean
}

export interface FusionRuleDocument {
  schemaVersion: number
  sourceOfTruth: string
  sourceGuide: string
  ingredientsAreCommutative: boolean
  precedence: string[]
  rules: FusionRule[]
  specificRecipes: SpecificFusionGroup[]
}

export interface FusionMatch {
  resultCardId: number
  source: 'specific-recipe' | 'rule'
  ruleId?: string
}

export type RewardCount = 1 | 5 | 10 | 15
export type DropSort = 'rate' | 'name' | 'id' | 'atk'
export type CardTypeFilter = 'all' | 'monsters' | 'magic' | 'trap'
