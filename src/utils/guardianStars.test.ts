import { describe, expect, it } from 'vitest'
import { getGuardianStarIconUrl } from './guardianStars'

describe('getGuardianStarIconUrl', () => {
  it.each([
    ['Sun', '/guardian_stars/sun.png'],
    ['Mars', '/guardian_stars/mars.png'],
    ['Jupiter', '/guardian_stars/jupiter.png'],
  ])('maps %s to its lowercase public asset', (guardianStar, expected) => {
    expect(getGuardianStarIconUrl(guardianStar)).toBe(expected)
  })
})
