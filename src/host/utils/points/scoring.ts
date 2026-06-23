import type { PointConfig } from '@/types';

export function recomputeTotal(scores: {
  baseScore: number;
  qualityScore: number;
  effectScore: number;
  behaviorScore: number;
}): number {
  return scores.baseScore + scores.qualityScore + scores.effectScore + scores.behaviorScore;
}

export function citationPointsForIndex(index: number, config: PointConfig): number {
  const { tier1Count, tier1Points, tier2Count, tier2Points, tier3Points } = config.effect.citation;
  if (index <= tier1Count) return tier1Points;
  if (index <= tier2Count) return tier2Points;
  return tier3Points;
}

export function computeCitationTotalScore(count: number, config: PointConfig): number {
  let total = 0;
  for (let i = 1; i <= count; i++) {
    total += citationPointsForIndex(i, config);
  }
  return Math.round(total * 10) / 10;
}

export function qualityScoreFromLevel(
  level: 'high' | 'medium' | 'low',
  config: PointConfig['quality'],
): number {
  if (level === 'high') return config.high;
  if (level === 'low') return config.low;
  return config.medium;
}
