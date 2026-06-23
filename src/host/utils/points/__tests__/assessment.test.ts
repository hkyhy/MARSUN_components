import { describe, expect, it } from 'vitest';
import { isAiAssessmentFailed } from '../assessment';

describe('isAiAssessmentFailed', () => {
  it('returns true when assessment is missing', () => {
    expect(isAiAssessmentFailed(null)).toBe(true);
    expect(isAiAssessmentFailed(undefined)).toBe(true);
  });

  it('returns true when assessment is fallback', () => {
    expect(
      isAiAssessmentFailed({
        level: 'medium',
        summary: '默认评估',
        assessedAt: new Date().toISOString(),
        fallback: true,
      }),
    ).toBe(true);
  });

  it('returns false for successful assessment', () => {
    expect(
      isAiAssessmentFailed({
        level: 'high',
        summary: '内容完整',
        assessedAt: new Date().toISOString(),
      }),
    ).toBe(false);
  });
});
