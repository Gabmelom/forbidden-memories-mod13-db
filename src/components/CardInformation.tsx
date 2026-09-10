import type { ReactNode } from 'react'
import type { Card } from '../types'
import { CardFactIcon, type CardFactIconName } from './CardFactIcon'
import { CardTypeLabel } from './CardTypeLabel'
import { GuardianStarLabel } from './GuardianStarLabel'

function CardFact({ label, value, icon, monospace = false }: { label: string; value: ReactNode; icon?: CardFactIconName; monospace?: boolean }) {
  return (
    <div className="card-fact">
      <dt>{label}</dt>
      <dd className={monospace ? 'monospace' : undefined}>
        {icon ? <span className="card-fact-value"><CardFactIcon name={icon} /><span>{value}</span></span> : value}
      </dd>
    </div>
  )
}

export function CardInformation({ card }: { card: Card }) {
  const guardianStars = [card.guardianStar1, card.guardianStar2].filter((star): star is string => Boolean(star))
  const isMonster = card.atk !== null || card.def !== null

  return (
    <section className="card-information" aria-labelledby="card-information-heading">
      <div className="section-heading">
        <div><p className="eyebrow">Card data</p><h2 id="card-information-heading">Card information</h2></div>
      </div>
      <dl className="card-facts">
        <CardFact label="Type" value={<CardTypeLabel cardType={card.type} />} />
        {isMonster && <CardFact label="ATK" value={card.atk ?? 'Unknown'} icon="sword" />}
        {isMonster && <CardFact label="DEF" value={card.def ?? 'Unknown'} icon="shield" />}
        {card.attribute != null && <CardFact label="Attribute" value={card.attribute} />}
        {card.level != null && <CardFact label="Level" value={card.level} />}
        {guardianStars.length > 0 && (
          <CardFact
            label="Guardian Stars"
            value={(
              <span className="guardian-star-list">
                {guardianStars.map((star, index) => (
                  <span className="guardian-star-item" key={`${star}-${index}`}>
                    <GuardianStarLabel guardianStar={star} />
                  </span>
                ))}
              </span>
            )}
          />
        )}
        {card.password !== undefined && <CardFact label="Password" value={card.password ?? 'Unavailable'} icon="store" monospace />}
        {card.cost !== undefined && <CardFact label="Cost" value={card.cost?.toLocaleString('en-US') ?? 'Unavailable'} icon="starchip" />}
        {card.description !== undefined && (
          <div className="card-fact card-description">
            <dt>Description</dt>
            <dd>{card.description ?? 'No description available.'}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
