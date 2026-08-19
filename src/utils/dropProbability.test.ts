import { describe, expect, it } from 'vitest'
import { getMultiDropProbability, getSingleDropProbability } from './dropProbability'

describe('drop probabilities', () => {
  it('calculates a single reward from the 2048 denominator', () => {
    expect(getSingleDropProbability(52)).toBeCloseTo(52 / 2048)
  })

  it('calculates the chance of at least one copy across rewards', () => {
    expect(getMultiDropProbability(52, 15)).toBeCloseTo(1 - Math.pow(1 - 52 / 2048, 15))
  })
})
