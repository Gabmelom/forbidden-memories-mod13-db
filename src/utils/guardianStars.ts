export function getGuardianStarIconUrl(guardianStar: string): string {
  return `${import.meta.env.BASE_URL}guardian_stars/${encodeURIComponent(guardianStar.toLowerCase())}.png`
}
