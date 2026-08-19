import { readFile } from 'node:fs/promises'

const dataDirectory = new URL('../src/data/', import.meta.url)
const readJson = async (name) => JSON.parse(await readFile(new URL(name, dataDirectory), 'utf8'))
const [cards, cardNames, duelists, drops] = await Promise.all([
  readJson('cards.json'),
  readJson('extracted-card-names.json'),
  readJson('duelists.json'),
  readJson('drops.json'),
])
const errors = []
const validRanks = new Set(['SA_POW', 'BCD', 'SA_TEC'])
const cardIds = new Set(cards.map((card) => card.id))
const duelistIds = new Set(duelists.map((duelist) => duelist.id))

function reportDuplicates(values, label) {
  const seen = new Set()
  for (const value of values) {
    if (seen.has(value)) errors.push(`Duplicate ${label}: ${value}`)
    seen.add(value)
  }
}

if (cardNames.length !== 722) errors.push(`Expected 722 extracted card names, found ${cardNames.length}`)
if (cards.length !== 722) errors.push(`Expected 722 cards with metadata, found ${cards.length}`)
if (duelists.length !== 39) errors.push(`Expected 39 duelists, found ${duelists.length}`)
reportDuplicates(cards.map((card) => card.id), 'metadata card ID')
reportDuplicates(cardNames.map((card) => card.id), 'card ID')
reportDuplicates(duelists.map((duelist) => duelist.id), 'duelist ID')
reportDuplicates(duelists.map((duelist) => duelist.slug), 'duelist slug')

for (let expectedId = 1; expectedId <= 722; expectedId += 1) {
  if (!cardIds.has(expectedId)) errors.push(`Missing card ID: ${expectedId}`)
}

const extractedNamesById = new Map(cardNames.map((card) => [card.id, card.name]))
cards.forEach((card) => {
  if (card.name !== extractedNamesById.get(card.id)) {
    errors.push(`Card ID ${card.id} does not preserve its extracted Mod 13 name`)
  }
  if (card.type === 'Magic' || card.type === 'Trap') {
    if (card.atk !== null || card.def !== null) {
      errors.push(`${card.type} card ID ${card.id} must have null atk/def`)
    }
  } else if (!Number.isFinite(card.atk) || !Number.isFinite(card.def)) {
    errors.push(`Monster card ID ${card.id} must have numeric atk/def`)
  }
})

drops.forEach((drop, index) => {
  const row = `drops.json row ${index + 1}`
  if (!cardIds.has(drop.cardId)) errors.push(`${row}: unknown cardId ${drop.cardId}`)
  if (!duelistIds.has(drop.duelistId)) errors.push(`${row}: unknown duelistId ${drop.duelistId}`)
  if (!validRanks.has(drop.rank)) errors.push(`${row}: invalid rank ${String(drop.rank)}`)
  if (!Number.isFinite(drop.weight) || drop.weight <= 0 || drop.weight > 2048) errors.push(`${row}: weight must be greater than 0 and at most 2048`)
})

const sortedDrops = [...drops].sort((left, right) =>
  left.duelistId - right.duelistId ||
  left.rank.localeCompare(right.rank) ||
  left.cardId - right.cardId,
)
if (drops.some((drop, index) =>
  drop.duelistId !== sortedDrops[index].duelistId ||
  drop.rank !== sortedDrops[index].rank ||
  drop.cardId !== sortedDrops[index].cardId,
)) {
  errors.push('Drop records are not sorted by duelistId, rank, cardId')
}

for (const duelist of duelists) {
  for (const rank of validRanks) {
    const total = drops
      .filter((drop) => drop.duelistId === duelist.id && drop.rank === rank)
      .reduce((sum, drop) => sum + drop.weight, 0)
    if (total !== 2048) errors.push(`${duelist.name} (${rank}) has total weight ${total}; expected 2048`)
  }
}

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} error(s):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exitCode = 1
} else {
  console.log(`Data validation passed: ${cards.length} cards, ${duelists.length} duelists, ${drops.length} drops.`)
}
