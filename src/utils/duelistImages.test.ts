import { describe, expect, it } from 'vitest'
import { getDuelistImageUrl } from './duelistImages'

describe('getDuelistImageUrl', () => {
  it.each([
    ['seto-2nd', '/mods/mod13/duelists/seto-2nd.webp'],
    ['pegasus', '/mods/mod13/duelists/pegasus.webp'],
    ['jono-2nd', '/mods/mod13/duelists/jono-2nd.webp'],
    ['heishin-2nd', '/mods/mod13/duelists/heishin-2nd.webp'],
  ])('maps %s to %s', (slug, expected) => {
    expect(getDuelistImageUrl('mods/mod13', slug)).toBe(expected)
  })
})
