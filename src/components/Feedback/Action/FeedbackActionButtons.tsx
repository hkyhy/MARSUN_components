import { hasPermission } from '@/components/Common/Auth';
import { useAuthStore } from '@/stores/authStore';
import type { FeedbackItem } from '@/types';
import { FeedbackStatus } from '@/types';
import ButtonGroup from '@kne/button-group';
import React from 'react';

interface FeedbackActionButtonsProps {
  record: FeedbackItem;
  onProcess: (record: FeedbackItem) => void;
  onProcessComplete: (record: FeedbackItem) => void;
  onClose: (record: FeedbackItem) => void;
  onReopen: (record: FeedbackItem) => void;
  onAssign: (record: FeedbackItem) => void;
  onTransfer: (record: FeedbackItem) => void;
  onPriorityChange: (record: FeedbackItem) => void;
  onDelete: (record: FeedbackItem) => void;
  onEdit: (record: FeedbackItem) => void;
}

/** 列表行操作按钮组 */
const FeedbackActionButtons: React.FC<FeedbackActionButtonsProps> = ({
  record,
  onProcess,
  onProcessComplete,
  onClose,
  onReopen,
  onAssign,
  onTransfer,
  onPriorityChange,
  onDelete,
  onEdit,
}) => {
  const { user } = useAuthStore();
  const canManage = hasPermission(user, 'feedback:manage');
  const isAssignee = !!record.assigneeId && record.assigneeId === user?.id;
  const canEditOwn =
    record.creatorId === user?.id && record.status === FeedbackStatus.PENDING;
  const canDeleteOwn = canEditOwn;
  const canTransfer =
    (canManage || isAssignee) &&
    record.assigneeId &&
    (record.status === FeedbackStatus.PENDING || record.status === FeedbackStatus.PROCESSING);

  const listArray: Record<string, unknown>[] = [
    {
      type: 'link',
      children: '处理',
      hidden: !canManage || record.status !== FeedbackStatus.PENDING,
      onClick: () => onProcess(record),
    },
    {
      type: 'link',
      children: '处理完成',
      hidden: !canManage || record.status !== FeedbackStatus.PROCESSING,
      onClick: () => onProcessComplete(record),
    },
    {
      type: 'link',
      children: '关闭',
      hidden:
        !canManage ||
        (record.status !== FeedbackStatus.PROCESSING && record.status !== FeedbackStatus.PROCESSED),
      onClick: () => onClose(record),
    },
    {
      type: 'link',
      children: '重新打开',
      hidden:
        !canManage ||
        (record.status !== FeedbackStatus.PROCESSED && record.status !== FeedbackStatus.CLOSED),
      onClick: () => onReopen(record),
    },
    {
      type: 'link',
      children: '指定负责人',
      hidden: !canManage || !!record.assigneeName,
      onClick: () => onAssign(record),
    },
    {
      type: 'link',
      children: '转交',
      hidden: !canTransfer,
      onClick: () => onTransfer(record),
    },
    {
      type: 'link',
      children: '优先级',
      hidden: !canManage,
      onClick: () => onPriorityChange(record),
    },
    {
      type: 'link',
      children: '编辑',
      hidden: !canEditOwn,
      onClick: () => onEdit(record),
    },
    {
      type: 'link',
      children: '删除',
      danger: true,
      hidden: !canDeleteOwn,
      onClick: () => onDelete(record),
    },
  ];

  return <ButtonGroup moreType="link" list={listArray} />;
};

export default FeedbackActionButtons;
