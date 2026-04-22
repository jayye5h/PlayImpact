export type DrawMode = 'random' | 'algorithm'

export function randomUniqueNumbers(count: number, min: number, max: number): number[] {
  if (count > max - min + 1) throw new Error('count too large for range')
  const set = new Set<number>()
  while (set.size < count) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min)
  }
  return Array.from(set)
}

export function intersectionCount(a: number[], b: number[]): number {
  const aSet = new Set(a)
  let count = 0
  const seen = new Set<number>()
  for (const n of b) {
    if (aSet.has(n) && !seen.has(n)) {
      count++
      seen.add(n)
    }
  }
  return count
}

export function calculatePrizeSplits(totalPool: number) {
  return {
    match5: totalPool * 0.4,
    match4: totalPool * 0.35,
    match3: totalPool * 0.25,
  }
}

export function clampProbability(p: number) {
  return Math.max(5, Math.min(95, Math.round(p)))
}

export function estimateWinningProbability(scores: number[]) {
  if (scores.length === 0) return 5

  const normalized = scores.slice(0, 5)
  const mean = normalized.reduce((s, n) => s + n, 0) / normalized.length
  const variance =
    normalized.reduce((s, n) => s + Math.pow(n - mean, 2), 0) / normalized.length
  const std = Math.sqrt(variance)

  const activityBoost = (normalized.length / 5) * 35
  const stabilityBoost = (1 - Math.min(std / 15, 1)) * 35
  const midRangeBoost = (1 - Math.min(Math.abs(mean - 23) / 22, 1)) * 20
  const base = 10

  return clampProbability(base + activityBoost + stabilityBoost + midRangeBoost)
}
