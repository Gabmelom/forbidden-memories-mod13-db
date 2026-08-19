import type { Card } from '../types'

export function CardSummary({ card, compact = false }: { card: Card; compact?: boolean }) {
  const isMonster = card.atk !== null || card.def !== null
  return (
    <div className={compact ? 'card-summary compact' : 'card-summary'}>
      <span className="card-id">#{card.id}</span>
      <div>
        <strong>{card.name}</strong>
        <div className="card-meta"><span>{card.type}</span>{isMonster && <span>ATK {card.atk ?? '—'} / DEF {card.def ?? '—'}</span>}</div>
      </div>
    </div>
  )
}
