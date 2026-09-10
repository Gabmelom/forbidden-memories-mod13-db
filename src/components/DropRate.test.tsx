// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { RewardCountProvider } from '../context/RewardCountProvider'
import { DropRate } from './DropRate'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('DropRate', () => {
  it('truncates the displayed weight without changing the source value', () => {
    render(<RewardCountProvider><DropRate weight={26.875} part="weight" /></RewardCountProvider>)
    expect(screen.getByText('26/2048')).toBeTruthy()
  })
})
