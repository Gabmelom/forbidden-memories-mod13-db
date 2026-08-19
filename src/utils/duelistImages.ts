export function getDuelistImageUrl(slug: string): string {
  return `${import.meta.env.BASE_URL}duelists/${slug}.webp`
}
