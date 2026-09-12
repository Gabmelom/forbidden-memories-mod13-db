#!/usr/bin/env node
/** Validate compact fusion rules against every FM2 Ghost card pair and raw TEA. */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..', '..')
const cards = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src', 'data', 'fm2-ghost', 'cards.json'), 'utf8'))
const normalizedGroups = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src', 'data', 'fm2-ghost', 'fusions.json'), 'utf8'))
const document = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src', 'data', 'fm2-ghost', 'fusion-rules.json'), 'utf8'))
const rawTea = JSON.parse(fs.readFileSync(path.join(scriptDirectory, 'tea_getdata_raw.json'), 'utf8'))
const cardsById = new Map(cards.map((card) => [card.id, card]))

const pairKey = (leftId, rightId) => leftId < rightId ? `${leftId}:${rightId}` : `${rightId}:${leftId}`
const expected = new Map()
const directionsByPair = new Map()
const rawConflicts = []

for (const [responseCardId, response] of Object.entries(rawTea.cards ?? {})) {
  if (response?.ok !== true || !Array.isArray(response?.resultados?.fusion)) {
    throw new Error(`Invalid raw TEA fusion response for card ${responseCardId}`)
  }
  for (const row of response.resultados.fusion) {
    const leftId = Number(row?.c1?.Numero)
    const rightId = Number(row?.c2?.Numero)
    const resultCardId = Number(row?.f?.Numero)
    if (!cardsById.has(leftId) || !cardsById.has(rightId) || !cardsById.has(resultCardId)) {
      throw new Error(`Raw TEA row references an unknown card: ${leftId} + ${rightId} -> ${resultCardId}`)
    }
    const key = pairKey(leftId, rightId)
    const previous = expected.get(key)
    if (previous !== undefined && previous !== resultCardId) rawConflicts.push({ key, previous, resultCardId })
    expected.set(key, resultCardId)
    const directions = directionsByPair.get(key) ?? new Set()
    directions.add(`${leftId}:${rightId}`)
    directionsByPair.set(key, directions)
  }
}

const normalized = new Map()
for (const group of normalizedGroups) {
  for (const [leftId, rightId] of group.materialCardPairs) normalized.set(pairKey(leftId, rightId), group.resultCardId)
}
const normalizationErrors = []
for (const [key, resultCardId] of expected) {
  if (normalized.get(key) !== resultCardId) normalizationErrors.push({ key, raw: resultCardId, normalized: normalized.get(key) })
}
for (const [key, resultCardId] of normalized) {
  if (expected.get(key) !== resultCardId) normalizationErrors.push({ key, raw: expected.get(key), normalized: resultCardId })
}

const missingDirections = []
for (const [key, directions] of directionsByPair) {
  const [leftId, rightId] = key.split(':').map(Number)
  if (leftId !== rightId && (!directions.has(`${leftId}:${rightId}`) || !directions.has(`${rightId}:${leftId}`))) {
    missingDirections.push(key)
  }
}

function matches(card, matcher) {
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

const specificByPair = new Map()
for (const group of document.specificRecipes) {
  for (const [leftId, rightId] of group.materialCardPairs) {
    const key = pairKey(leftId, rightId)
    if (specificByPair.has(key)) throw new Error(`Duplicate specific recipe for ${key}`)
    specificByPair.set(key, { resultCardId: group.resultCardId, ruleId: `specific:${key}` })
  }
}

function evaluate(leftId, rightId) {
  const specific = specificByPair.get(pairKey(leftId, rightId))
  if (specific) return specific
  const left = cardsById.get(leftId)
  const right = cardsById.get(rightId)
  for (const rule of document.rules) {
    if ((matches(left, rule.left) && matches(right, rule.right))
        || (matches(right, rule.left) && matches(left, rule.right))) {
      return { resultCardId: rule.resultCardId, ruleId: rule.id }
    }
  }
  return null
}

function cardSummary(cardId) {
  const card = cardsById.get(cardId)
  return `#${card.id} ${card.name} [${card.type}, ATK ${card.atk}, DEF ${card.def}, attribute ${card.attribute}]`
}

let matchedCorrectly = 0
let falsePositives = 0
let falseNegatives = 0
let wrongResults = 0
let orderingErrors = 0
const failures = []

for (let leftIndex = 0; leftIndex < cards.length; leftIndex += 1) {
  for (let rightIndex = leftIndex; rightIndex < cards.length; rightIndex += 1) {
    const leftId = cards[leftIndex].id
    const rightId = cards[rightIndex].id
    const key = pairKey(leftId, rightId)
    const expectedResult = expected.get(key)
    const calculated = evaluate(leftId, rightId)
    const reversed = evaluate(rightId, leftId)
    if (calculated?.resultCardId !== reversed?.resultCardId) orderingErrors += 1

    if (expectedResult === calculated?.resultCardId) {
      if (expectedResult !== undefined) matchedCorrectly += 1
      continue
    }
    if (expectedResult === undefined && calculated) falsePositives += 1
    else if (expectedResult !== undefined && !calculated) falseNegatives += 1
    else wrongResults += 1
    if (failures.length < 50) {
      failures.push([
        cardSummary(leftId),
        cardSummary(rightId),
        `expected: ${expectedResult === undefined ? 'no fusion' : cardSummary(expectedResult)}`,
        `calculated: ${calculated ? cardSummary(calculated.resultCardId) : 'no fusion'}`,
        `matched rule: ${calculated?.ruleId ?? 'none'}`,
      ].join('\n  '))
    }
  }
}

const specificPairCount = [...specificByPair].length
const ruleEntryCount = document.rules.length + specificPairCount
console.log(`Rules: ${ruleEntryCount} (${document.rules.length} generalized, ${specificPairCount} specific pairs)`)
console.log(`TEA fusion pairs: ${expected.size}`)
console.log(`Matched correctly: ${matchedCorrectly}`)
console.log(`False positives: ${falsePositives}`)
console.log(`False negatives: ${falseNegatives}`)
console.log(`Wrong result: ${wrongResults}`)
console.log(`Ordering errors: ${orderingErrors}`)
console.log(`Raw TEA result conflicts: ${rawConflicts.length}`)
console.log(`Raw pairs missing a recorded reverse direction: ${missingDirections.length}`)
console.log(`Raw/normalized disagreements: ${normalizationErrors.length}`)

if (failures.length) {
  console.log('\nFailures (first 50):')
  for (const failure of failures) console.log(`\n  ${failure}`)
}

const errorCount = falsePositives + falseNegatives + wrongResults + orderingErrors
  + rawConflicts.length + missingDirections.length + normalizationErrors.length
process.exitCode = errorCount === 0 ? 0 : 1
