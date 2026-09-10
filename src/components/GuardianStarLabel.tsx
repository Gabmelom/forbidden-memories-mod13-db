import { useState } from 'react'
import { getGuardianStarIconUrl } from '../utils/guardianStars'

export function GuardianStarLabel({ guardianStar }: { guardianStar: string }) {
  const source = getGuardianStarIconUrl(guardianStar)
  const [failedSource, setFailedSource] = useState<string | null>(null)

  return (
    <span className="guardian-star-label">
      {failedSource !== source && (
        <img className="guardian-star-icon" src={source} alt="" aria-hidden="true" onError={() => setFailedSource(source)} />
      )}
      <span>{guardianStar}</span>
    </span>
  )
}
