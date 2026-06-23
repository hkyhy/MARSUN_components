import type { FeedbackItem } from '@/types';
import { UserRole } from '@/types';

/** 能管理反馈的角色（修改优先级、处理、关闭） */
export type FeedbackManagerRole = UserRole.SYSTEM_ADMIN | UserRole.DEPT_LEADER;

/** 反馈操作回调 */
export interface FeedbackActionCallbacks {
  onProcess: (record: FeedbackItem) => void;
  onProcessComplete: (record: FeedbackItem) => void;
  onClose: (record: FeedbackItem) => void;
  onReopen: (record: FeedbackItem) => void;
  onAssign: (record: FeedbackItem) => void;
  onTransfer: (record: FeedbackItem) => void;
  onPriorityChange: (record: FeedbackItem) => void;
}
