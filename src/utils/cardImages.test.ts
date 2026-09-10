import { describe, expect, it } from 'vitest'
import { getCardImageUrl } from './cardImages'

describe('getCardImageUrl', () => {
  it.each([
    [1, '/mods/mod13/cards/001.webp'],
    [82, '/mods/mod13/cards/082.webp'],
    [337, '/mods/mod13/cards/337.webp'],
    [722, '/mods/mod13/cards/722.webp'],
  ])('formats card ID %i as %s', (cardId, expected) => {
    expect(getCardImageUrl('/mods/mod13/', cardId)).toBe(expected)
  })
})
