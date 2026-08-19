import { useEffect, useState, type ReactNode } from 'react'
import type { RewardCount } from '../types'
import { RewardCountContext } from './RewardCountContext'

const STORAGE_KEY = 'fm-mod-13-reward-count'
const VALID_REWARD_COUNTS: RewardCount[] = [1, 5, 10, 15]

function getStoredRewardCount(): RewardCount {
  const stored = Number(localStorage.getItem(STORAGE_KEY))
  return VALID_REWARD_COUNTS.includes(stored as RewardCount) ? (stored as RewardCount) : 15
}

export function RewardCountProvider({ children }: { children: ReactNode }) {
  const [rewardCount, setRewardCount] = useState<RewardCount>(getStoredRewardCount)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(rewardCount))
  }, [rewardCount])

  return <RewardCountContext.Provider value={{ rewardCount, setRewardCount }}>{children}</RewardCountContext.Provider>
}
