import { useRewardCount } from '../context/RewardCountContext'
import { DROP_DENOMINATOR, formatMultiDropProbability } from '../utils/dropProbability'

export function DropRate({ weight, part }: { weight: number; part: 'weight' | 'duel' }) {
  const { rewardCount } = useRewardCount()
  if (part === 'weight') return <span className="rate-weight">{Math.trunc(weight)}/{DROP_DENOMINATOR}</span>
  return <span>{formatMultiDropProbability(weight, rewardCount)}</span>
}
