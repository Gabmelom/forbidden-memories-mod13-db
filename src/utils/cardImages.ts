export function getCardImageUrl(assetBase: string, cardId: number): string {
  const normalizedBase = assetBase.replace(/^\/+|\/+$/g, '')
  return `${import.meta.env.BASE_URL}${normalizedBase}/cards/${String(cardId).padStart(3, '0')}.webp`
}
