import { describe, expect, it } from 'vitest'
import { getCardTypeIconUrl, getCardTypeLabel } from './cardTypes'

describe('card type presentation', () => {
  it.each([
    ['Dragon', 'Dragon', '/types/Dragon.png'],
    ['BeastWarrior', 'Beast-Warrior', '/types/Beast-Warrior.png'],
    ['SeaSerpent', 'Sea Serpent', '/types/Sea%20Serpent.png'],
    ['WingedBeast', 'Winged Beast', '/types/Winged%20Beast.png'],
  ])('maps %s to its shared label and icon', (cardType, label, iconUrl) => {
    expect(getCardTypeLabel(cardType)).toBe(label)
    expect(getCardTypeIconUrl(cardType)).toBe(iconUrl)
  })
})
