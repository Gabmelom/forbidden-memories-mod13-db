import type { Card, Drop, Duelist, EquipCompatibility, RitualRecipe } from '../types'

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
  emptyDataMessage?: string
  metadata?: Record<string, unknown>
}
