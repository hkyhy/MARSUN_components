import { SEMANTIC_COLORS } from '@/components/Common';
import type { AssessmentTaskStatus } from '@/types';

export const ASSESSMENT_TASK_STATUS_LABEL: Record<AssessmentTaskStatus, string> = {
  PENDING: '待处理',
  RUNNING: '运行中',
  COMPLETED: '已完成',
  FAILED: '失败',
  CANCELLED: '已取消',
};

export const ASSESSMENT_TASK_STATUS_OPTIONS = (
  Object.entries(ASSESSMENT_TASK_STATUS_LABEL) as [AssessmentTaskStatus, string][]
).map(([value, label]) => ({ value, label }));

export const QUALITY_LEVEL_LABEL: Record<string, string> = {
  high: '极高质量',
  medium: '高质量',
  low: '中等质量',
};

export const QUALITY_LEVEL_COLOR: Record<
  string,
  (typeof SEMANTIC_COLORS)[keyof typeof SEMANTIC_COLORS]
> = {
  high: SEMANTIC_COLORS.SUCCESS,
  medium: SEMANTIC_COLORS.INFO,
  low: SEMANTIC_COLORS.WARNING,
};

export const QUALITY_LEVEL_OPTIONS: { value: string; label: string }[] = (
  ['high', 'medium', 'low'] as const
).map((value) => ({
  value,
  label: QUALITY_LEVEL_LABEL[value]!,
}));
