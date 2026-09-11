import type { Card } from '../types'
import { CardImage } from './CardImage'

export function CardSummary({ card, compact = false, grid = false }: { card: Card; compact?: boolean; grid?: boolean }) {
  if (grid) {
    return (
      <div className="card-summary-grid">
        <CardImage cardId={card.id} cardName={card.name} size="medium" decorative />
      </div>
    )
  }

  const isMonster = card.atk !== null || card.def !== null
  return (
    <div className={compact ? 'card-summary compact' : 'card-summary'}>
      <CardImage cardId={card.id} cardName={card.name} size="medium" decorative />
      <div className="card-summary-text">
        <span className="card-id">#{card.id}</span>
        <strong>{card.name}</strong>
        <div className="card-meta"><span>{card.type ?? 'Unknown type'}</span>{isMonster && <span>ATK {card.atk ?? '—'} / DEF {card.def ?? '—'}</span>}</div>
      </div>
    </div>
  )
}
