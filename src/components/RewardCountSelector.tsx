import { useRewardCount } from '../context/RewardCountContext'
import type { RewardCount } from '../types'

const choices: RewardCount[] = [1, 5, 10, 15]

export function RewardCountSelector() {
  const { rewardCount, setRewardCount } = useRewardCount()
  return (
    <div className="reward-selector" aria-label="Rewards per duel">
      <span className="reward-label">Rewards <span>per duel</span></span>
      <div className="segmented-control">
        {choices.map((choice) => (
          <button type="button" key={choice} className={choice === rewardCount ? 'active' : ''} aria-pressed={choice === rewardCount} onClick={() => setRewardCount(choice)}>{choice}</button>
        ))}
      </div>
    </div>
  )
}
