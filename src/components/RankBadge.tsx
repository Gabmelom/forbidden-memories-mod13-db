import type { DropRank } from '../types'
import { RANK_LABELS } from '../utils/rankLabels'

export function RankBadge({ rank }: { rank: DropRank }) {
  return <span className={`rank-badge rank-${rank.toLocaleLowerCase()}`}>{RANK_LABELS[rank]}</span>
}
