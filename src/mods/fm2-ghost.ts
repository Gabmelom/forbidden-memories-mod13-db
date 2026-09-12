import cardsJson from '../data/fm2-ghost/cards.json'
import dropsJson from '../data/fm2-ghost/drops.json'
import duelistsJson from '../data/fm2-ghost/duelists.json'
import equipsJson from '../data/fm2-ghost/equips.json'
import fusionsJson from '../data/fm2-ghost/fusions.json'
import ritualsJson from '../data/fm2-ghost/rituals.json'
import type { Card, Drop, Duelist, EquipCompatibility, FusionGroup, RitualRecipe } from '../types'
import type { ModDefinition } from './types'

export const fm2Ghost: ModDefinition = {
  id: 'fm2-ghost',
  label: 'FM2 Ghost',
  title: 'Forbidden Memories DB',
  subtitle: 'FM2 Ghost card drops and farming lookup',
  assetBase: 'mods/fm2-ghost',
  cards: cardsJson as Card[],
  duelists: duelistsJson as Duelist[],
  drops: dropsJson as Drop[],
  rituals: ritualsJson as RitualRecipe[],
  equips: equipsJson as EquipCompatibility[],
  fusions: fusionsJson as FusionGroup[],
  emptyDataMessage: 'FM2 Ghost data has not been imported yet.',
}
