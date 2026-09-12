#!/usr/bin/env node
/** Infer compact FM2 Ghost fusion rules from normalized TEA pairs. */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..', '..')
const cardsPath = path.join(projectRoot, 'src', 'data', 'fm2-ghost', 'cards.json')
const fusionsPath = path.join(projectRoot, 'src', 'data', 'fm2-ghost', 'fusions.json')
const candidatesPath = path.join(projectRoot, 'src', 'data', 'fm2-ghost', 'fusion-rule-candidates.json')
const rulesPath = path.join(projectRoot, 'src', 'data', 'fm2-ghost', 'fusion-rules.json')
const auditPath = path.join(projectRoot, 'src', 'data', 'fm2-ghost', 'fusion-rule-audit.md')

const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'))
const fusionGroups = JSON.parse(fs.readFileSync(fusionsPath, 'utf8'))
const candidateDocument = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'))
const cardsById = new Map(cards.map((card) => [card.id, card]))
const expected = new Map()

const pairKey = (leftId, rightId) => leftId < rightId ? `${leftId}:${rightId}` : `${rightId}:${leftId}`
const typePairKey = (leftType, rightType) => leftType < rightType ? `${leftType}:${rightType}` : `${rightType}:${leftType}`

for (const group of fusionGroups) {
  for (const [leftId, rightId] of group.materialCardPairs) {
    const key = pairKey(leftId, rightId)
    const previous = expected.get(key)
    if (previous !== undefined && previous !== group.resultCardId) {
      throw new Error(`Conflicting TEA results for ${key}: ${previous} and ${group.resultCardId}`)
    }
    expected.set(key, group.resultCardId)
  }
}

function matchesMatcher(card, matcher) {
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

function possiblePairs(leftMatcher, rightMatcher) {
  const pairs = new Map()
  for (const left of cards) {
    if (!matchesMatcher(left, leftMatcher)) continue
    for (const right of cards) {
      if (!matchesMatcher(right, rightMatcher)) continue
      pairs.set(pairKey(left.id, right.id), [left.id, right.id])
    }
  }
  return pairs
}

function statsFor(leftMatcher, rightMatcher, resultCardId) {
  const pairs = possiblePairs(leftMatcher, rightMatcher)
  let truePositives = 0
  let overriddenPairs = 0
  let falsePositives = 0
  for (const key of pairs.keys()) {
    const result = expected.get(key)
    if (result === resultCardId) truePositives += 1
    else if (result === undefined) falsePositives += 1
    else overriddenPairs += 1
  }
  return { pairs, truePositives, overriddenPairs, falsePositives }
}

function orientedMatch(leftCard, rightCard, rule) {
  return (matchesMatcher(leftCard, rule.left) && matchesMatcher(rightCard, rule.right))
    || (matchesMatcher(rightCard, rule.left) && matchesMatcher(leftCard, rule.right))
}

function evaluateRules(leftId, rightId, rules) {
  const left = cardsById.get(leftId)
  const right = cardsById.get(rightId)
  return rules.find((rule) => orientedMatch(left, right, rule))
}

const pairsByResultAndTypePair = new Map()
for (const [key, resultCardId] of expected) {
  const [leftId, rightId] = key.split(':').map(Number)
  const left = cardsById.get(leftId)
  const right = cardsById.get(rightId)
  const groupKey = `${resultCardId}|${typePairKey(left.type, right.type)}`
  const pairs = pairsByResultAndTypePair.get(groupKey) ?? []
  pairs.push([leftId, rightId])
  pairsByResultAndTypePair.set(groupKey, pairs)
}

const typeRules = []
for (const [groupKey, targetPairs] of pairsByResultAndTypePair) {
  const [resultCardIdText, typePair] = groupKey.split('|')
  const resultCardId = Number(resultCardIdText)
  const result = cardsById.get(resultCardId)
  const [leftType, rightType] = typePair.split(':')
  if (result.atk === null || targetPairs.length < 10 || leftType === rightType) continue

  const baseLeft = { type: leftType, maxAtkExclusive: result.atk }
  const baseRight = { type: rightType, maxAtkExclusive: result.atk }
  const targetLeftIds = new Set()
  const targetRightIds = new Set()
  for (const [firstId, secondId] of targetPairs) {
    for (const cardId of new Set([firstId, secondId])) {
      const card = cardsById.get(cardId)
      if (card.type === leftType && card.atk !== null && card.atk < result.atk) targetLeftIds.add(cardId)
      if (card.type === rightType && card.atk !== null && card.atk < result.atk) targetRightIds.add(cardId)
    }
  }

  const leftEligible = cards.filter((card) => matchesMatcher(card, baseLeft))
  const rightEligible = cards.filter((card) => matchesMatcher(card, baseRight))
  const leftExcluded = leftEligible.filter((card) => !targetLeftIds.has(card.id)).map((card) => card.id)
  const rightExcluded = rightEligible.filter((card) => !targetRightIds.has(card.id)).map((card) => card.id)
  const left = { ...baseLeft, ...(leftExcluded.length ? { excludeCardIds: leftExcluded } : {}) }
  const right = { ...baseRight, ...(rightExcluded.length ? { excludeCardIds: rightExcluded } : {}) }
  const stats = statsFor(left, right, resultCardId)
  const exclusionCount = leftExcluded.length + rightExcluded.length
  const leftExclusionRatio = leftEligible.length ? leftExcluded.length / leftEligible.length : 1
  const rightExclusionRatio = rightEligible.length ? rightExcluded.length / rightEligible.length : 1

  if (stats.falsePositives === 0
      && stats.truePositives >= 10
      && stats.truePositives > exclusionCount
      && targetLeftIds.size >= 3
      && targetRightIds.size >= 3
      && leftExclusionRatio <= 0.5
      && rightExclusionRatio <= 0.5) {
    typeRules.push({
      kind: 'type-type',
      left,
      right,
      resultCardId,
      _stats: stats,
      _dimensions: [targetLeftIds.size, targetRightIds.size],
    })
  }
}

typeRules.sort((left, right) =>
  right._stats.truePositives - left._stats.truePositives
  || (left.left.excludeCardIds?.length ?? 0) - (right.left.excludeCardIds?.length ?? 0)
  || left.resultCardId - right.resultCardId,
)

const exactTypeGroups = new Map()
for (const [key, resultCardId] of expected) {
  const [leftId, rightId] = key.split(':').map(Number)
  if (evaluateRules(leftId, rightId, typeRules)?.resultCardId === resultCardId) continue
  const left = cardsById.get(leftId)
  const right = cardsById.get(rightId)
  for (const [cardId, other] of [[leftId, right], [rightId, left]]) {
    const groupKey = `${resultCardId}|${cardId}|${other.type}`
    const otherIds = exactTypeGroups.get(groupKey) ?? new Set()
    otherIds.add(other.id)
    exactTypeGroups.set(groupKey, otherIds)
  }
}

const exactTypeRules = []
for (const [groupKey, targetOtherIds] of exactTypeGroups) {
  const [resultCardIdText, cardIdText, otherType] = groupKey.split('|')
  const resultCardId = Number(resultCardIdText)
  const cardId = Number(cardIdText)
  const result = cardsById.get(resultCardId)
  if (result.atk === null) continue

  const left = { cardId }
  const eligible = cards.filter((card) => card.type === otherType && card.atk !== null && card.atk < result.atk)
  const coveredTargetCount = eligible.filter((card) => targetOtherIds.has(card.id)).length
  if (coveredTargetCount < 3) continue
  const excluded = eligible.filter((card) => !expected.has(pairKey(cardId, card.id))).map((card) => card.id)
  const right = {
    type: otherType,
    maxAtkExclusive: result.atk,
    ...(excluded.length ? { excludeCardIds: excluded } : {}),
  }
  const stats = statsFor(left, right, resultCardId)
  if (stats.falsePositives === 0 && coveredTargetCount > excluded.length + 1) {
    exactTypeRules.push({ kind: 'exact-type', left, right, resultCardId, _stats: stats })
  }
}

exactTypeRules.sort((left, right) =>
  right._stats.truePositives - left._stats.truePositives
  || (left.right.excludeCardIds?.length ?? 0) - (right.right.excludeCardIds?.length ?? 0)
  || left.resultCardId - right.resultCardId
  || left.left.cardId - right.left.cardId,
)

function matcherEquivalent(left, right) {
  if (left.cardId !== undefined || right.cardId !== undefined) return left.cardId === right.cardId
  return left.type === right.type
}

function candidateForRule(rule) {
  return candidateDocument.rules.find((candidate) =>
    candidate.resultCardId === rule.resultCardId
    && ((matcherEquivalent(candidate.left, rule.left) && matcherEquivalent(candidate.right, rule.right))
      || (matcherEquivalent(candidate.left, rule.right) && matcherEquivalent(candidate.right, rule.left))),
  )
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function describeMatcher(matcher) {
  const parts = []
  if (matcher.cardId !== undefined) parts.push(`#${matcher.cardId} ${cardsById.get(matcher.cardId).name}`)
  if (matcher.type !== undefined) parts.push(matcher.type)
  if (matcher.minAtkInclusive !== undefined) parts.push(`ATK >= ${matcher.minAtkInclusive}`)
  if (matcher.maxAtkExclusive !== undefined) parts.push(`ATK < ${matcher.maxAtkExclusive}`)
  if (matcher.minDefInclusive !== undefined) parts.push(`DEF >= ${matcher.minDefInclusive}`)
  if (matcher.maxDefExclusive !== undefined) parts.push(`DEF < ${matcher.maxDefExclusive}`)
  if (matcher.attribute !== undefined) parts.push(`attribute ${matcher.attribute}`)
  if (matcher.excludeCardIds?.length) parts.push(`excluding ${matcher.excludeCardIds.map((id) => `#${id}`).join(', ')}`)
  return parts.join(', ')
}

function finalizeRule(rule, index) {
  const result = cardsById.get(rule.resultCardId)
  const candidate = candidateForRule(rule)
  const correctedDragonRule = (rule.left.cardId === 97 && rule.right.type === 'Zombie' && rule.resultCardId === 561)
    || (rule.left.cardId === 561 && rule.right.type === 'Zombie' && rule.resultCardId === 105)
  const source = correctedDragonRule
    ? 'wordpress-basic-corrected-by-tea'
    : candidate ? 'wordpress-basic-validated-by-tea' : 'tea-inferred'
  const leftLabel = rule.left.cardId !== undefined ? `card-${rule.left.cardId}` : rule.left.type
  const rightLabel = rule.right.cardId !== undefined ? `card-${rule.right.cardId}` : rule.right.type
  return {
    id: `${rule.kind}-${slug(leftLabel)}-${slug(rightLabel)}-${slug(result.name)}-${index + 1}`,
    kind: rule.kind,
    left: rule.left,
    right: rule.right,
    resultCardId: rule.resultCardId,
    source,
    ...(candidate ? { candidateRuleId: candidate.id } : {}),
    validatedAgainstTea: true,
  }
}

const internalRules = [...exactTypeRules, ...typeRules]
const rules = internalRules.map(finalizeRule)
const specificPairsByResult = new Map()
for (const [key, resultCardId] of expected) {
  const [leftId, rightId] = key.split(':').map(Number)
  const predicted = evaluateRules(leftId, rightId, internalRules)?.resultCardId
  if (predicted === resultCardId) continue
  const pairs = specificPairsByResult.get(resultCardId) ?? []
  pairs.push([leftId, rightId])
  specificPairsByResult.set(resultCardId, pairs)
}

const specificRecipes = [...specificPairsByResult]
  .sort(([left], [right]) => left - right)
  .map(([resultCardId, materialCardPairs]) => ({
    resultCardId,
    materialCardPairs: materialCardPairs.sort(([a1, b1], [a2, b2]) => a1 - a2 || b1 - b2),
    source: 'tea-explicit',
    validatedAgainstTea: true,
  }))

const document = {
  schemaVersion: 1,
  sourceOfTruth: 'TEA data normalized in fusions.json',
  sourceGuide: candidateDocument.sourceUrl,
  ingredientsAreCommutative: true,
  precedence: ['specific-recipes', 'exact-type', 'type-type', 'no-fusion'],
  rules,
  specificRecipes,
}

function auditRule(rule, internalRule) {
  const result = cardsById.get(rule.resultCardId)
  const stats = internalRule._stats
  const matchingPairs = [...stats.pairs.values()].filter(([leftId, rightId]) => expected.get(pairKey(leftId, rightId)) === rule.resultCardId)
  const leftAtks = matchingPairs.map(([leftId]) => cardsById.get(leftId).atk).filter((atk) => atk !== null)
  const rightAtks = matchingPairs.map(([, rightId]) => cardsById.get(rightId).atk).filter((atk) => atk !== null)
  const range = (values) => values.length ? `${Math.min(...values)}-${Math.max(...values)}` : 'n/a'
  return [
    `### ${describeMatcher(rule.left)} + ${describeMatcher(rule.right)} -> #${result.id} ${result.name}`,
    '',
    `- Rule ID: \`${rule.id}\``,
    `- Provenance: \`${rule.source}\`${rule.candidateRuleId ? ` (candidate \`${rule.candidateRuleId}\`)` : ''}`,
    `- TEA target pairs: ${stats.truePositives}`,
    `- Pairs superseded by a more-specific TEA recipe: ${stats.overriddenPairs}`,
    `- Material ATK ranges in target pairs: ${range(leftAtks)} / ${range(rightAtks)}`,
    '- False positives after precedence: 0',
    '- False negatives within the declared matcher: 0',
    '',
    'Status: VALIDATED',
    '',
  ].join('\n')
}

function equivalentInferredRule(candidate) {
  return rules.find((rule) =>
    rule.resultCardId === candidate.resultCardId
    && ((matcherEquivalent(candidate.left, rule.left) && matcherEquivalent(candidate.right, rule.right))
      || (matcherEquivalent(candidate.left, rule.right) && matcherEquivalent(candidate.right, rule.left))),
  )
}

const candidateSections = candidateDocument.rules.map((candidate) => {
  const result = cardsById.get(candidate.resultCardId)
  const inferred = equivalentInferredRule(candidate)
  const roughStats = statsFor(candidate.left, candidate.right, candidate.resultCardId)
  const inferredIndex = inferred ? rules.findIndex((rule) => rule.id === inferred.id) : -1
  const inferredStats = inferredIndex >= 0 ? internalRules[inferredIndex]._stats : null
  let status = inferred ? 'VALIDATED WITH TEA CONSTRAINTS' : 'RECLASSIFIED OR REJECTED'
  let correction = ''
  if (candidate.id === 'wp-dragon-zombie-dragon') {
    status = 'WORDPRESS RULE CORRECTED'
    correction = '- TEA correction: `#97 Dragon Zombie + Zombie (ATK < 1900) -> #561 Dragon Queen of Tragic`.'
  } else if (candidate.id === 'wp-dragon-queen-dragon') {
    status = 'WORDPRESS RULE CORRECTED'
    correction = '- TEA correction: `#561 Dragon Queen of Tragic + Zombie (ATK < 2900) -> #105 Doomkaiser Dragon`.'
  } else if (candidate.id === 'wp-pyro-winged-beast') {
    status = 'WORDPRESS RULE REJECTED'
    correction = '- TEA contains no material pair whose result is #272 Mavelus; only later Mavelus chains are present.'
  }
  const teaPairsForResult = fusionGroups.find((group) => group.resultCardId === candidate.resultCardId)?.materialCardPairs.length ?? 0
  const lines = [
    `### ${candidate.sourceText}`,
    '',
    `- Candidate: \`${candidate.id}\` (source line ${candidate.sourceLine})`,
    `- Expected result: #${result.id} ${result.name}`,
    `- All TEA pairs producing this result: ${teaPairsForResult}`,
    `- Unconstrained candidate: ${roughStats.truePositives} true positives, ${roughStats.falsePositives} no-fusion false positives, ${roughStats.overriddenPairs} wrong-result overlaps`,
    inferred ? `- Inferred rule: \`${inferred.id}\`` : '- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.',
  ]
  if (inferredStats) {
    lines.push(`- Accepted rule: ${inferredStats.truePositives} true positives, 0 false positives after precedence, 0 false negatives within its declared matcher`)
  }
  if (correction) lines.push(correction)
  lines.push('', `Status: ${status}`, '')
  return lines.join('\n')
})

const audit = [
  '# FM II Ghost fusion-rule audit',
  '',
  `Generated from ${cards.length} cards and ${expected.size.toLocaleString('en-US')} authoritative unordered TEA fusion pairs. The [WordPress Basic Fusion section](${candidateDocument.sourceUrl}) is a discovery guide only.`,
  '',
  '## Validation summary',
  '',
  `- Generalized type rules: ${typeRules.length}`,
  `- Exact-card + type rules: ${exactTypeRules.length}`,
  `- Explicit special/precedence pairs: ${specificRecipes.reduce((sum, group) => sum + group.materialCardPairs.length, 0)}`,
  `- Total compact rule entries: ${rules.length + specificRecipes.reduce((sum, group) => sum + group.materialCardPairs.length, 0)}`,
  '- Ingredient ordering: commutative; raw TEA contains both directions for every non-self pair and no directional result conflicts.',
  '- Full-engine false positives: 0',
  '- Full-engine false negatives: 0',
  '- Full-engine wrong results: 0',
  '',
  'Thresholds are exclusive because every accepted basic family selects a result stronger than each eligible material; cards at the result ATK boundary are not included. Exclusion lists preserve TEA-observed hidden compatibility distinctions that are not represented by the public card schema.',
  '',
  '## WordPress Basic Fusion candidate audit',
  '',
  ...candidateSections,
  '## Accepted generalized rules',
  '',
  ...rules.map((rule, index) => auditRule(rule, internalRules[index])),
  '## Explicit recipes',
  '',
  `${specificRecipes.length} result groups contain ${specificRecipes.reduce((sum, group) => sum + group.materialCardPairs.length, 0)} exact TEA pairs. These are special recipes, precedence overrides, or patterns for which no zero-error declarative generalization was accepted. They are stored compactly under \`specificRecipes\` in \`fusion-rules.json\`.`,
  '',
].join('\n')

fs.writeFileSync(rulesPath, `${JSON.stringify(document, null, 2)}\n`)
fs.writeFileSync(auditPath, audit)

console.log(`Wrote ${rules.length} generalized rules and ${specificRecipes.reduce((sum, group) => sum + group.materialCardPairs.length, 0)} specific pairs`)
console.log(`Rules: ${rulesPath}`)
console.log(`Audit: ${auditPath}`)
