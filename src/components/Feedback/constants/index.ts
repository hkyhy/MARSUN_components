/** 反馈模块常量 */
import { SEMANTIC_COLORS } from '@/components/Common/Tag/SemanticTag';

export const FEEDBACK_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: '待处理', color: SEMANTIC_COLORS.WARNING },
  PROCESSING: { label: '处理中', color: SEMANTIC_COLORS.PROCESSING },
  PROCESSED: { label: '已处理', color: SEMANTIC_COLORS.SUCCESS },
  CLOSED: { label: '已关闭', color: SEMANTIC_COLORS.DEFAULT },
};

export const FEEDBACK_ACTION_MAP: Record<string, { label: string; color: string }> = {
  PROCESS: { label: '开始处理', color: SEMANTIC_COLORS.INFO },
  PROCESSED: { label: '处理完成', color: SEMANTIC_COLORS.SUCCESS },
  CLOSE: { label: '关闭', color: SEMANTIC_COLORS.DEFAULT },
  REOPEN: { label: '重新打开', color: SEMANTIC_COLORS.WARNING },
  ASSIGN: { label: '指定负责人', color: SEMANTIC_COLORS.OTHER },
  TRANSFER: { label: '转交', color: SEMANTIC_COLORS.OTHER },
  PRIORITY_CHANGE: { label: '修改优先级', color: SEMANTIC_COLORS.CYAN },
  EDIT: { label: '编辑反馈', color: SEMANTIC_COLORS.INFO },
};

export const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  high: { label: '高', color: SEMANTIC_COLORS.DANGER },
  medium: { label: '中', color: SEMANTIC_COLORS.WARNING },
  low: { label: '低', color: SEMANTIC_COLORS.DEFAULT },
};

export const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  bug: { label: '问题反馈', color: SEMANTIC_COLORS.DANGER },
  feature: { label: '功能建议', color: SEMANTIC_COLORS.INFO },
  other: { label: '其他', color: SEMANTIC_COLORS.DEFAULT },
};

export const CATEGORY_OPTIONS = [
  { value: 'bug', label: '问题反馈' },
  { value: 'feature', label: '功能建议' },
  { value: 'other', label: '其他' },
];

export const PRIORITY_OPTIONS = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];
