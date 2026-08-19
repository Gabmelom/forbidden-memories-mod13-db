import { useState } from 'react'
import { getDuelistImageUrl } from '../utils/duelistImages'

interface DuelistImageProps {
  slug: string
  name: string
  size?: 'small' | 'medium' | 'large'
  loading?: 'lazy' | 'eager'
  decorative?: boolean
}

export function DuelistImage({
  slug,
  name,
  size = 'medium',
  loading = 'lazy',
  decorative = false,
}: DuelistImageProps) {
  const source = getDuelistImageUrl(slug)
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const failed = failedSource === source

  return (
    <span className={`duelist-image duelist-image-${size}`}>
      {failed ? (
        <span className="duelist-image-fallback" aria-label={decorative ? undefined : `No portrait available for ${name}`} aria-hidden={decorative || undefined}>
          <strong aria-hidden="true">?</strong>
          <span>{name}</span>
        </span>
      ) : (
        <img
          src={source}
          alt={decorative ? '' : name}
          loading={loading}
          decoding="async"
          onError={() => setFailedSource(source)}
        />
      )}
    </span>
  )
}
