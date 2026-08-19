import { describe, expect, it } from 'vitest'
import { getCardImageUrl } from './cardImages'

describe('getCardImageUrl', () => {
  it.each([
    [1, '/cards/001.webp'],
    [82, '/cards/082.webp'],
    [337, '/cards/337.webp'],
    [722, '/cards/722.webp'],
  ])('formats card ID %i as %s', (cardId, expected) => {
    expect(getCardImageUrl(cardId)).toBe(expected)
  })
})
