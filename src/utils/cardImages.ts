export function getCardImageUrl(cardId: number): string {
  return `${import.meta.env.BASE_URL}cards/${String(cardId).padStart(3, '0')}.webp`
}
