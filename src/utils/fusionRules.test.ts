import { describe, expect, it } from 'vitest'
import cardsJson from '../data/fm2-ghost/cards.json'
import fusionRulesJson from '../data/fm2-ghost/fusion-rules.json'
import type { Card, FusionRuleDocument } from '../types'
import { createFusionRuleEngine } from './fusionRules'

const engine = createFusionRuleEngine(cardsJson as Card[], fusionRulesJson as FusionRuleDocument)
const fuse = (leftCardId: number, rightCardId: number) => engine.fuse(leftCardId, rightCardId)?.resultCardId ?? null

describe('FM2 Ghost fusion rules', () => {
  it('applies a normal generic type fusion', () => {
    expect(fuse(5, 65)).toBe(233) // Ryu-kishin + Silver Fang -> Berfomet
  })

  it('includes the ATK value immediately below a generic threshold', () => {
    expect(fuse(5, 91)).toBe(233) // Mystic Horseman has 1300 ATK; threshold is 1400
  })

  it('excludes a material at the generic ATK threshold', () => {
    expect(fuse(5, 168)).toBeNull() // Fenrir has exactly 1400 ATK
  })

  it('treats material ordering as commutative', () => {
    expect(fuse(65, 5)).toBe(233)
    expect(fuse(5, 65)).toBe(fuse(65, 5))
  })

  it('allows a fusion result to enter a chained rule', () => {
    expect(fuse(233, 65)).toBe(85) // Berfomet + Silver Fang -> King of Yamimakai
  })

  it('lets a specific recipe override a generalized rule', () => {
    expect(fuse(4, 16)).toBe(69) // Baby Dragon + Time Wizard -> Thousand Dragon
    expect(fuse(545, 561)).toBe(39) // General chain would otherwise produce Doomkaiser Dragon
  })

  it('uses the TEA-corrected Dragon Zombie chain', () => {
    expect(fuse(97, 24)).toBe(561) // Dragon Zombie + Skull Servant (Zombie)
    expect(fuse(97, 4)).not.toBe(561) // WordPress incorrectly says the partner is Dragon
  })

  it('returns no result for a non-fusing pair', () => {
    expect(fuse(1, 5)).toBeNull()
  })

  it('preserves hidden TEA compatibility exclusions', () => {
    expect(fuse(160, 65)).toBeNull() // Gishki Vision is excluded from the normal Aqua + Beast rule
  })
})
