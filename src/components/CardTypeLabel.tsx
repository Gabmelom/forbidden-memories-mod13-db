import { useState } from 'react'
import { getCardTypeIconUrl, getCardTypeLabel } from '../utils/cardTypes'

export function CardTypeLabel({ cardType }: { cardType: string | null }) {
  const source = cardType ? getCardTypeIconUrl(cardType) : null
  const [failedSource, setFailedSource] = useState<string | null>(null)

  if (!cardType) return <span>Unknown</span>

  return (
    <span className="card-type-label">
      {source && failedSource !== source && (
        <img className="card-type-icon" src={source} alt="" aria-hidden="true" onError={() => setFailedSource(source)} />
      )}
      <span>{getCardTypeLabel(cardType)}</span>
    </span>
  )
}
