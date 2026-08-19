export const DROP_DENOMINATOR = 2048

export function getSingleDropProbability(weight: number): number {
  return weight / DROP_DENOMINATOR
}

export function getMultiDropProbability(weight: number, rewardCount: number): number {
  const probability = getSingleDropProbability(weight)
  return 1 - Math.pow(1 - probability, rewardCount)
}

export function formatSingleDropProbability(weight: number): string {
  return `${(getSingleDropProbability(weight) * 100).toFixed(2)}%`
}

export function formatMultiDropProbability(weight: number, rewardCount: number): string {
  return `${(getMultiDropProbability(weight, rewardCount) * 100).toFixed(1)}%`
}
