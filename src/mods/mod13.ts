import cardsJson from '../data/mod13/cards.json'
import dropsJson from '../data/mod13/drops.json'
import duelistsJson from '../data/mod13/duelists.json'
import type { Card, Drop, Duelist } from '../types'
import type { ModDefinition } from './types'

export const mod13: ModDefinition = {
  id: 'mod13',
  label: 'Mod 13',
  title: 'Forbidden Memories DB',
  subtitle: 'Mod 13 card drops and farming lookup',
  assetBase: 'mods/mod13',
  cards: cardsJson as Card[],
  duelists: duelistsJson as Duelist[],
  drops: dropsJson as Drop[],
}
