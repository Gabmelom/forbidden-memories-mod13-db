import type {
  Card,
  FusionCardMatcher,
  FusionGroup,
  FusionMatch,
  FusionRule,
  FusionRuleDocument,
} from '../types'

export function normalizeFusionPairKey(leftCardId: number, rightCardId: number): string {
  return leftCardId < rightCardId
    ? `${leftCardId}:${rightCardId}`
    : `${rightCardId}:${leftCardId}`
}

export function matchesFusionCard(card: Card, matcher: FusionCardMatcher): boolean {
  if (matcher.cardId !== undefined && card.id !== matcher.cardId) return false
  if (matcher.type !== undefined && card.type !== matcher.type) return false
  if (matcher.minAtkInclusive !== undefined && (card.atk === null || card.atk < matcher.minAtkInclusive)) return false
  if (matcher.maxAtkExclusive !== undefined && (card.atk === null || card.atk >= matcher.maxAtkExclusive)) return false
  if (matcher.minDefInclusive !== undefined && (card.def === null || card.def < matcher.minDefInclusive)) return false
  if (matcher.maxDefExclusive !== undefined && (card.def === null || card.def >= matcher.maxDefExclusive)) return false
  if (matcher.attribute !== undefined && card.attribute !== matcher.attribute) return false
  if (matcher.excludeCardIds?.includes(card.id)) return false
  return true
}

export function matchesFusionRule(left: Card, right: Card, rule: FusionRule): boolean {
  return (matchesFusionCard(left, rule.left) && matchesFusionCard(right, rule.right))
    || (matchesFusionCard(right, rule.left) && matchesFusionCard(left, rule.right))
}

export interface FusionRuleEngine {
  fuse: (leftCardId: number, rightCardId: number) => FusionMatch | null
  expandFusionGroups: () => FusionGroup[]
}

export function createFusionRuleEngine(cards: Card[], document: FusionRuleDocument): FusionRuleEngine {
  const cardsById = new Map(cards.map((card) => [card.id, card]))
  const specificResultsByPair = new Map<string, number>()

  for (const group of document.specificRecipes) {
    for (const [leftCardId, rightCardId] of group.materialCardPairs) {
      specificResultsByPair.set(normalizeFusionPairKey(leftCardId, rightCardId), group.resultCardId)
    }
  }

  const fuse = (leftCardId: number, rightCardId: number): FusionMatch | null => {
    const specificResult = specificResultsByPair.get(normalizeFusionPairKey(leftCardId, rightCardId))
    if (specificResult !== undefined) return { resultCardId: specificResult, source: 'specific-recipe' }

    const left = cardsById.get(leftCardId)
    const right = cardsById.get(rightCardId)
    if (!left || !right) return null
    const rule = document.rules.find((candidate) => matchesFusionRule(left, right, candidate))
    return rule ? { resultCardId: rule.resultCardId, source: 'rule', ruleId: rule.id } : null
  }

  const expandFusionGroups = (): FusionGroup[] => {
    const pairsByResult = new Map<number, [number, number][]>()
    for (let leftIndex = 0; leftIndex < cards.length; leftIndex += 1) {
      for (let rightIndex = leftIndex; rightIndex < cards.length; rightIndex += 1) {
        const leftCardId = cards[leftIndex].id
        const rightCardId = cards[rightIndex].id
        const match = fuse(leftCardId, rightCardId)
        if (!match) continue
        const pairs = pairsByResult.get(match.resultCardId) ?? []
        pairs.push(leftCardId < rightCardId ? [leftCardId, rightCardId] : [rightCardId, leftCardId])
        pairsByResult.set(match.resultCardId, pairs)
      }
    }
    return [...pairsByResult]
      .sort(([leftResult], [rightResult]) => leftResult - rightResult)
      .map(([resultCardId, materialCardPairs]) => ({ resultCardId, materialCardPairs }))
  }

  return { fuse, expandFusionGroups }
}
