import cardsJson from '../data/cards.json'
import duelistsJson from '../data/duelists.json'
import dropsJson from '../data/drops.json'
import type { Card, Drop, DropRank, DropSort, Duelist } from '../types'

export const cards = cardsJson as Card[]
export const duelists = duelistsJson as Duelist[]
export const drops = dropsJson as Drop[]

const cardsById = new Map(cards.map((card) => [card.id, card]))
const duelistsById = new Map(duelists.map((duelist) => [duelist.id, duelist]))
const duelistsBySlug = new Map(duelists.map((duelist) => [duelist.slug, duelist]))

export function getCardById(cardId: number): Card | undefined {
  return cardsById.get(cardId)
}

export function getDuelistById(duelistId: number): Duelist | undefined {
  return duelistsById.get(duelistId)
}

export function getDuelistBySlug(slug: string): Duelist | undefined {
  return duelistsBySlug.get(slug)
}

export function getDropsForCard(cardId: number): Drop[] {
  return drops.filter((drop) => drop.cardId === cardId)
}

export function getDropsForDuelist(duelistId: number): Drop[] {
  return drops.filter((drop) => drop.duelistId === duelistId)
}

export function getDropsForDuelistAndRank(duelistId: number, rank: DropRank): Drop[] {
  return drops.filter((drop) => drop.duelistId === duelistId && drop.rank === rank)
}

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
