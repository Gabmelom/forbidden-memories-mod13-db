export function getCardImageUrl(cardId: number): string {
  return `/cards/${String(cardId).padStart(3, '0')}.webp`
}
