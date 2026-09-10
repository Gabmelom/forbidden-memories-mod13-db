import type { Card, Drop, Duelist } from '../types'

export interface ModDefinition {
  id: string
  label: string
  title: string
  subtitle: string
  assetBase: string
  cards: Card[]
  duelists: Duelist[]
  drops: Drop[]
  emptyDataMessage?: string
  metadata?: Record<string, unknown>
}
