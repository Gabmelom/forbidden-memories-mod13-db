import { access, readFile } from 'node:fs/promises'

const projectRoot = new URL('../', import.meta.url)
const duelists = JSON.parse(await readFile(new URL('src/data/duelists.json', projectRoot), 'utf8'))
const missing = []

for (const duelist of duelists) {
  try {
    await access(new URL(`public/duelists/${duelist.slug}.webp`, projectRoot))
  } catch {
    missing.push(duelist)
  }
}

console.log(`Duelists: ${duelists.length}`)
console.log(`Portraits present: ${duelists.length - missing.length}`)
console.log(`Missing: ${missing.length}`)

if (missing.length) {
  console.log('\nMissing portraits:')
  missing.forEach((duelist) => console.log(`- ${duelist.slug} — ${duelist.name}`))
  process.exitCode = 1
}
