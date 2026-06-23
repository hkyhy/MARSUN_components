import type { AiAssessment } from '@/types';

/** AI 评估是否失败或未生成（含 fallback 默认评估） */
export function isAiAssessmentFailed(assessment?: AiAssessment | null): boolean {
  return !assessment || assessment.fallback === true;
}
