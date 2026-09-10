const CARD_TYPE_ALIASES: Record<string, string> = {
  BeastWarrior: 'Beast-Warrior',
  SeaSerpent: 'Sea Serpent',
  WingedBeast: 'Winged Beast',
}

export function getCardTypeLabel(cardType: string): string {
  return CARD_TYPE_ALIASES[cardType] ?? cardType
}

export function getCardTypeIconUrl(cardType: string): string {
  return `${import.meta.env.BASE_URL}types/${encodeURIComponent(getCardTypeLabel(cardType))}.png`
}
