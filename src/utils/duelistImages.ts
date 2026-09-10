export function getDuelistImageUrl(assetBase: string, slug: string): string {
  const normalizedBase = assetBase.replace(/^\/+|\/+$/g, '')
  return `${import.meta.env.BASE_URL}${normalizedBase}/duelists/${slug}.webp`
}
