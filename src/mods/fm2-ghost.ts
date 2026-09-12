import cardsJson from '../data/fm2-ghost/cards.json'
import dropsJson from '../data/fm2-ghost/drops.json'
import duelistsJson from '../data/fm2-ghost/duelists.json'
import equipsJson from '../data/fm2-ghost/equips.json'
import fusionRulesJson from '../data/fm2-ghost/fusion-rules.json'
import ritualsJson from '../data/fm2-ghost/rituals.json'
import type { Card, Drop, Duelist, EquipCompatibility, FusionRuleDocument, RitualRecipe } from '../types'
import type { ModDefinition } from './types'

const cards = cardsJson as Card[]

export const fm2Ghost: ModDefinition = {
  id: 'fm2-ghost',
  label: 'FM2 Ghost',
  title: 'Forbidden Memories DB',
  subtitle: 'FM2 Ghost card drops and farming lookup',
  assetBase: 'mods/fm2-ghost',
  cards,
  duelists: duelistsJson as Duelist[],
  drops: dropsJson as Drop[],
  rituals: ritualsJson as RitualRecipe[],
  equips: equipsJson as EquipCompatibility[],
  fusionRules: fusionRulesJson as FusionRuleDocument,
  emptyDataMessage: 'FM2 Ghost data has not been imported yet.',
}
