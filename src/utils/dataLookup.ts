import type { Card, Drop, DropRank, DropSort, Duelist } from '../types'
import type { ModDefinition } from '../mods/types'

export interface CardDropRow {
  card: Card
  drop: Drop
}

export function sortCardDropRows(rows: CardDropRow[], sort: DropSort): CardDropRow[] {
  return [...rows].sort((left, right) => {
    if (sort === 'name') return left.card.name.localeCompare(right.card.name)
    if (sort === 'id') return left.card.id - right.card.id
    if (sort === 'atk') {
      if (left.card.atk === null) return right.card.atk === null ? left.card.name.localeCompare(right.card.name) : 1
      if (right.card.atk === null) return -1
      return right.card.atk - left.card.atk || left.card.name.localeCompare(right.card.name)
    }
    return right.drop.weight - left.drop.weight || left.card.name.localeCompare(right.card.name)
  })
}

function appendToIndex<Key>(index: Map<Key, Drop[]>, key: Key, drop: Drop) {
  const indexedDrops = index.get(key)
  if (indexedDrops) indexedDrops.push(drop)
  else index.set(key, [drop])
}

export interface DataLookup {
  cards: Card[]
  duelists: Duelist[]
  drops: Drop[]
  getCardById: (cardId: number) => Card | undefined
  getDuelistById: (duelistId: number) => Duelist | undefined
  getDuelistBySlug: (slug: string) => Duelist | undefined
  getDropsForCard: (cardId: number) => Drop[]
  getDropsForDuelist: (duelistId: number) => Drop[]
  getDropsForDuelistAndRank: (duelistId: number, rank: DropRank) => Drop[]
  sortCardDropRows: typeof sortCardDropRows
}

export function createDataLookup(mod: ModDefinition): DataLookup {
  const cardsById = new Map(mod.cards.map((card) => [card.id, card]))
  const duelistsById = new Map(mod.duelists.map((duelist) => [duelist.id, duelist]))
  const duelistsBySlug = new Map(mod.duelists.map((duelist) => [duelist.slug, duelist]))
  const dropsByCardId = new Map<number, Drop[]>()
  const dropsByDuelistId = new Map<number, Drop[]>()
  const dropsByDuelistAndRank = new Map<string, Drop[]>()

  for (const drop of mod.drops) {
    appendToIndex(dropsByCardId, drop.cardId, drop)
    appendToIndex(dropsByDuelistId, drop.duelistId, drop)
    appendToIndex(dropsByDuelistAndRank, `${drop.duelistId}:${drop.rank}`, drop)
  }

  return {
    cards: mod.cards,
    duelists: mod.duelists,
    drops: mod.drops,
    getCardById: (cardId) => cardsById.get(cardId),
    getDuelistById: (duelistId) => duelistsById.get(duelistId),
    getDuelistBySlug: (slug) => duelistsBySlug.get(slug),
    getDropsForCard: (cardId) => dropsByCardId.get(cardId) ?? [],
    getDropsForDuelist: (duelistId) => dropsByDuelistId.get(duelistId) ?? [],
    getDropsForDuelistAndRank: (duelistId, rank) => dropsByDuelistAndRank.get(`${duelistId}:${rank}`) ?? [],
    sortCardDropRows,
  }
}
