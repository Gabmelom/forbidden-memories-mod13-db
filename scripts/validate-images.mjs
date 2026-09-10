import { access, readFile } from 'node:fs/promises'

const projectRoot = new URL('../', import.meta.url)
const cards = JSON.parse(await readFile(new URL('src/data/mod13/cards.json', projectRoot), 'utf8'))
const missing = []

for (let cardId = 1; cardId <= 722; cardId += 1) {
  const card = cards.find((candidate) => candidate.id === cardId)
  const filename = `${String(cardId).padStart(3, '0')}.webp`
  try {
    await access(new URL(`public/mods/mod13/cards/${filename}`, projectRoot))
  } catch {
    missing.push({ id: cardId, name: card?.name ?? 'Unknown card', filename })
  }
}

console.log('Card images: 722')
console.log(`Present: ${722 - missing.length}`)
console.log(`Missing: ${missing.length}`)

if (missing.length) {
  console.log('\nMissing:')
  missing.forEach(({ id, name, filename }) => console.log(`${filename}  #${id} ${name}`))
  process.exitCode = 1
}
