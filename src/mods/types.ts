import type { Card, Drop, Duelist, EquipCompatibility, FusionGroup, FusionRuleDocument, RitualRecipe } from '../types'

export interface ModDefinition {
  id: string
  label: string
  title: string
  subtitle: string
  assetBase: string
  cards: Card[]
  duelists: Duelist[]
  drops: Drop[]
  rituals?: RitualRecipe[]
  equips?: EquipCompatibility[]
  fusions?: FusionGroup[]
  fusionRules?: FusionRuleDocument
  emptyDataMessage?: string
  metadata?: Record<string, unknown>
}
