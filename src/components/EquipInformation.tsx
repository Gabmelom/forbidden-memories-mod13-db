import { Link } from 'react-router-dom'
import type { Card } from '../types'
import { CardImage } from './CardImage'

interface EquipInformationProps {
  cards: Card[]
  modId: string
}

export function EquipInformation({ cards, modId }: EquipInformationProps) {
  return (
    <section className="detail-section equip-information" aria-labelledby="equip-information-heading">
      <div className="section-heading">
        <div><p className="eyebrow">Compatible cards</p><h2 id="equip-information-heading">Equips</h2></div>
        <span>{cards.length} {cards.length === 1 ? 'card' : 'cards'}</span>
      </div>
      {cards.length ? (
        <div className="equip-card-grid">
          {cards.map((card) => (
            <Link key={card.id} className="equip-card-link" to={`/${modId}/cards/${card.id}`}>
              <CardImage cardId={card.id} cardName={card.name} size="small" decorative />
              <span className="equip-card-text"><span>#{card.id}</span><strong>{card.name}</strong></span>
            </Link>
          ))}
        </div>
      ) : <div className="empty-state equip-empty-state">No compatible equip cards are recorded for this card.</div>}
    </section>
  )
}
