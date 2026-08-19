import { createContext, useContext } from 'react'
import type { RewardCount } from '../types'

export interface RewardCountContextValue {
  rewardCount: RewardCount
  setRewardCount: (value: RewardCount) => void
}

export const RewardCountContext = createContext<RewardCountContextValue | null>(null)

export function useRewardCount(): RewardCountContextValue {
  const context = useContext(RewardCountContext)
  if (!context) throw new Error('useRewardCount must be used inside RewardCountProvider')
  return context
}
