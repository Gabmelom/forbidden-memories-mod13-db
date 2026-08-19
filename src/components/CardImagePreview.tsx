import { CardImage } from './CardImage'
import { ImagePreviewModal } from './ImagePreviewModal'

interface CardImagePreviewProps {
  cardId: number
  cardName: string
  onClose: () => void
}

export function CardImagePreview({ cardId, cardName, onClose }: CardImagePreviewProps) {
  return (
    <ImagePreviewModal title={`${cardName} image preview`} caption={`#${cardId} · ${cardName}`} onClose={onClose}>
      <CardImage cardId={cardId} cardName={cardName} size="large" loading="eager" />
    </ImagePreviewModal>
  )
}
