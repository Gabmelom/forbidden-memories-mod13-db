import { useRewardCount } from '../context/RewardCountContext'
import { DROP_DENOMINATOR, formatMultiDropProbability, formatSingleDropProbability } from '../utils/dropProbability'

export function DropRate({ weight, part }: { weight: number; part: 'weight' | 'single' | 'duel' }) {
  const { rewardCount } = useRewardCount()
  if (part === 'weight') return <span className="rate-weight">{weight}/{DROP_DENOMINATOR}</span>
  if (part === 'single') return <span>{formatSingleDropProbability(weight)}</span>
  return <span>{formatMultiDropProbability(weight, rewardCount)}</span>
}
