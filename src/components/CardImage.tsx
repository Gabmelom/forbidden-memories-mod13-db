import { useState } from 'react'
import { useMod } from '../context/ModContext'
import { getCardImageUrl } from '../utils/cardImages'

interface CardImageProps {
  cardId: number
  cardName: string
  size?: 'small' | 'medium' | 'large'
  loading?: 'lazy' | 'eager'
  decorative?: boolean
}

export function CardImage({
  cardId,
  cardName,
  size = 'medium',
  loading = 'lazy',
  decorative = false,
}: CardImageProps) {
  const { mod } = useMod()
  const source = getCardImageUrl(mod.assetBase, cardId)
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const failed = failedSource === source

  return (
    <span className={`card-image card-image-${size}`}>
      {failed ? (
        <span className="card-image-fallback" aria-label={decorative ? undefined : `No image available for ${cardName}`} aria-hidden={decorative || undefined}>
          <span>No image</span>
          <strong>#{cardId}</strong>
        </span>
      ) : (
        <img
          src={source}
          alt={decorative ? '' : cardName}
          loading={loading}
          decoding="async"
          onError={() => setFailedSource(source)}
        />
      )}
    </span>
  )
}
