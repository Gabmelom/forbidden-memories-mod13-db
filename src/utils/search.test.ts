import { describe, expect, it } from 'vitest'
import { normalizeSearch } from './search'

describe('normalizeSearch', () => {
  it('trims, lowercases, and ignores punctuation', () => {
    expect(normalizeSearch("  BLUE-EYES' B. Dragon ")).toBe('blue eyes b dragon')
  })
})
