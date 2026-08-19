import type { Card } from '../types'
import { normalizeSearch } from './search'

export interface CardAdvancedFilters {
  attribute: string | null
  minAtk: number | null
  maxAtk: number | null
  minDef: number | null
  maxDef: number | null
  minLevel: number | null
  maxLevel: number | null
  guardianStar: string | null
}

export interface CardCatalogFilters {
  search: string
  type: string
  advanced: CardAdvancedFilters
}

export interface NumericRange {
  min: number
  max: number
}

export type AdvancedFilterCategory = 'attribute' | 'atk' | 'def' | 'level' | 'guardianStar'

export const EMPTY_ADVANCED_CARD_FILTERS: CardAdvancedFilters = {
  attribute: null,
  minAtk: null,
  maxAtk: null,
  minDef: null,
  maxDef: null,
  minLevel: null,
  maxLevel: null,
  guardianStar: null,
}

export function isValidRange(min: number | null, max: number | null): boolean {
  return min === null || max === null || min <= max
}

function matchesRange(value: number | null | undefined, min: number | null, max: number | null): boolean {
  if (min === null && max === null) return true
  if (!isValidRange(min, max)) return true
  if (value === null || value === undefined) return false
  return (min === null || value >= min) && (max === null || value <= max)
}

function matchesCategory(value: string | null | undefined, selected: string | null): boolean {
  if (!selected) return true
  return Boolean(value) && normalizeSearch(value ?? '') === normalizeSearch(selected)
}

export function matchesAdvancedFilters(card: Card, filters: CardAdvancedFilters): boolean {
  if (!matchesCategory(card.attribute, filters.attribute)) return false
  if (!matchesRange(card.atk, filters.minAtk, filters.maxAtk)) return false
  if (!matchesRange(card.def, filters.minDef, filters.maxDef)) return false
  if (!matchesRange(card.level, filters.minLevel, filters.maxLevel)) return false

  if (filters.guardianStar) {
    const selected = normalizeSearch(filters.guardianStar)
    const matchesGuardianStar = [card.guardianStar1, card.guardianStar2]
      .some((star) => Boolean(star) && normalizeSearch(star ?? '') === selected)
    if (!matchesGuardianStar) return false
  }

  return true
}

export function matchesCardType(card: Card, selectedType: string): boolean {
  if (selectedType === 'all') return true
  if (selectedType === 'monsters') return card.atk !== null || card.def !== null
  return normalizeSearch(card.type) === normalizeSearch(selectedType)
}

export function matchesCardCatalogFilters(card: Card, filters: CardCatalogFilters): boolean {
  const normalizedQuery = normalizeSearch(filters.search)
  if (normalizedQuery && !normalizeSearch(`${card.name} ${card.id}`).includes(normalizedQuery)) return false
  return matchesCardType(card, filters.type) && matchesAdvancedFilters(card, filters.advanced)
}

export function filterCards(cardList: Card[], filters: CardCatalogFilters): Card[] {
  return cardList.filter((card) => matchesCardCatalogFilters(card, filters))
}

export function countActiveAdvancedFilters(filters: CardAdvancedFilters): number {
  return Number(Boolean(filters.attribute))
    + Number(filters.minAtk !== null || filters.maxAtk !== null)
    + Number(filters.minDef !== null || filters.maxDef !== null)
    + Number(filters.minLevel !== null || filters.maxLevel !== null)
    + Number(Boolean(filters.guardianStar))
}

function getCategoricalValues(cardList: Card[], fields: Array<keyof Card>): string[] {
  const values = cardList.flatMap((card) => fields.map((field) => card[field]))
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
  return [...new Set(values)].sort((left, right) => left.localeCompare(right))
}

export function getAvailableAttributes(cardList: Card[]): string[] {
  return getCategoricalValues(cardList, ['attribute'])
}

export function getAvailableGuardianStars(cardList: Card[]): string[] {
  return getCategoricalValues(cardList, ['guardianStar1', 'guardianStar2'])
}

export function getAvailableCardTypes(cardList: Card[]): string[] {
  return getCategoricalValues(cardList, ['type'])
}

export function getNumericRange(cardList: Card[], field: 'atk' | 'def' | 'level'): NumericRange | null {
  const values = cardList.map((card) => card[field]).filter((value): value is number => typeof value === 'number')
  return values.length ? { min: Math.min(...values), max: Math.max(...values) } : null
}

export function removeAdvancedFilter(
  filters: CardAdvancedFilters,
  category: AdvancedFilterCategory,
): CardAdvancedFilters {
  if (category === 'attribute') return { ...filters, attribute: null }
  if (category === 'atk') return { ...filters, minAtk: null, maxAtk: null }
  if (category === 'def') return { ...filters, minDef: null, maxDef: null }
  if (category === 'level') return { ...filters, minLevel: null, maxLevel: null }
  return { ...filters, guardianStar: null }
}
