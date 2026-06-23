import { describe, expect, it } from 'vitest';
import {
  citationPointsForIndex,
  computeCitationTotalScore,
  qualityScoreFromLevel,
  recomputeTotal,
} from '../scoring';

const CONFIG = {
  base: { pointsPerFile: 10 },
  quality: { high: 15, medium: 8, low: 0 },
  effect: {
    citation: { tier1Count: 10, tier1Points: 2, tier2Count: 100, tier2Points: 1, tier3Points: 0.1 },
    like: { pointsPerLike: 5 },
    excludeSelf: true,
  },
  behavior: { excellentCasePoints: 20, maxPerReviewerPerMonth: 5 },
};

describe('point scoring utils', () => {
  it('recomputeTotal sums four types', () => {
    expect(recomputeTotal({ baseScore: 10, qualityScore: 15, effectScore: 7, behaviorScore: 20 })).toBe(
      52,
    );
  });

  it('maps quality levels', () => {
    expect(qualityScoreFromLevel('high', CONFIG.quality)).toBe(15);
    expect(qualityScoreFromLevel('medium', CONFIG.quality)).toBe(8);
    expect(qualityScoreFromLevel('low', CONFIG.quality)).toBe(0);
  });

  it('applies citation tiers', () => {
    expect(citationPointsForIndex(1, CONFIG)).toBe(2);
    expect(citationPointsForIndex(11, CONFIG)).toBe(1);
    expect(citationPointsForIndex(101, CONFIG)).toBe(0.1);
    expect(computeCitationTotalScore(12, CONFIG)).toBe(22);
  });
});
