import { describe, expect, it } from 'vitest'
import { getDuelistImageUrl } from './duelistImages'

describe('getDuelistImageUrl', () => {
  it.each([
    ['seto-2nd', '/duelists/seto-2nd.webp'],
    ['pegasus', '/duelists/pegasus.webp'],
    ['jono-2nd', '/duelists/jono-2nd.webp'],
    ['heishin-2nd', '/duelists/heishin-2nd.webp'],
  ])('maps %s to %s', (slug, expected) => {
    expect(getDuelistImageUrl(slug)).toBe(expected)
  })
})
