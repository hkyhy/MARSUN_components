import { hasPermission } from '@/components/Common/Auth';
import { isReviewFileDeleted } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import type { ReviewListItem } from '@/types';
import { UserRole } from '@/types';
import ButtonGroup from '@kne/button-group';
import React from 'react';
import {
  getArchiveConfirmMessage,
  getReleaseConfirmMessage,
  getRevokeConfirmMessage,
  getSubmitConfirmMessage,
  handleArchiveReview,
  handleReleaseReview,
  handleRevokeReview,
  handleSubmitReview,
} from './handlers';

export type ReviewActionMode = 'pending' | 'processed' | 'received' | 'initiated' | 'all';

interface ReviewActionButtonsProps {
  mode: ReviewActionMode;
  record: ReviewListItem;
  onActionComplete: () => void;
  /** 审核人操作回调（打开 Modal） */
  onReviewAction?: (
    action: 'approve' | 'reject' | 'return' | 'transfer',
    record: ReviewListItem,
  ) => void;
  /** 重新上传回调 */
  onReupload?: (record: ReviewListItem) => void;
  moreType: 'default' | 'link';
}

const ReviewActionButtons: React.FC<ReviewActionButtonsProps> = ({
  mode,
  moreType,
  record,
  onActionComplete,
  onReviewAction,
  onReupload,
}) => {
  const { hasAnyRole, user } = useAuthStore();
  const isSystemAdmin = hasAnyRole([UserRole.SYSTEM_ADMIN]);
  const isReviewer = hasAnyRole([UserRole.REVIEWER]);
  const canApprove = hasPermission(user, 'review:approve');
  const canReject = hasPermission(user, 'review:reject');
  const canTransfer = hasPermission(user, 'review:transfer');
  const canReview = isReviewer && canApprove;

  const status = record.reviewStatus || '';
  const fileDeleted = isReviewFileDeleted(record);

  if (fileDeleted) {
    return null;
  }

  // 所有中间态
  const ALL_REVIEWING_STATES = [
    'PENDING_REVIEWER',
    'REVIEWING_REVIEWER',
    'PENDING_SECOND_REVIEWER',
    'REVIEWING_SECOND_REVIEWER',
  ];
  const isPending = ALL_REVIEWING_STATES.includes(status);
  const canSubmitOrReupload = ['DRAFT', 'REJECTED', 'RETURNED', 'REVOKED'].includes(status);
  const canRevoke = ALL_REVIEWING_STATES.includes(status);
  const isReviewing = status === 'REVIEWING_REVIEWER' || status === 'REVIEWING_SECOND_REVIEWER';
  const canArchive = isSystemAdmin && status === 'APPROVED';

  const isReviewerMode = mode === 'pending' || mode === 'received' || mode === 'all';
  const isInitiatorMode = mode === 'initiated';
  const canReviewAction = (canReview || (isSystemAdmin && canApprove)) && isPending;

  const listArray: Record<string, unknown>[] = [
    // 审核人操作
    {
      type: moreType === 'default' ? 'primary' : 'link',
      children: '通过',
      onClick: () => onReviewAction?.('approve', record),
      hidden: !isReviewerMode || !canReviewAction || !canApprove,
    },
    {
      type: moreType === 'default' ? 'default' : 'link',
      children: '驳回',
      onClick: () => onReviewAction?.('reject', record),
      hidden: !isReviewerMode || !canReviewAction || !canReject,
    },
    {
      type: moreType === 'default' ? 'default' : 'link',
      children: '退回修改',
      onClick: () => onReviewAction?.('return', record),
      hidden: !isReviewerMode || !canReviewAction || !canReject,
    },
    {
      type: moreType === 'default' ? 'default' : 'link',
      children: '转审',
      onClick: () => onReviewAction?.('transfer', record),
      hidden: !isReviewerMode || !canReviewAction || !canTransfer,
    },
    {
      type: moreType === 'default' ? 'default' : 'link',
      children: '释放',
      isDelete: false,
      message: getReleaseConfirmMessage(record),
      onClick: () => handleReleaseReview(record, onActionComplete),
      hidden: !isReviewerMode || !isReviewing,
    },
    // 发起人操作
    {
      type: moreType === 'default' ? 'default' : 'link',
      children: '重新上传',
      onClick: () => onReupload?.(record),
      hidden: !isInitiatorMode || !canSubmitOrReupload,
    },
    {
      type: moreType === 'default' ? 'default' : 'link',
      children: '提交审核',
      isDelete: false,
      message: getSubmitConfirmMessage(record),
      onClick: () => handleSubmitReview(record, onActionComplete),
      hidden: !isInitiatorMode || !canSubmitOrReupload,
    },
    {
      type: moreType === 'default' ? 'default' : 'link',
      children: '撤销审核',
      isDelete: false,
      message: getRevokeConfirmMessage(record),
      onClick: () => handleRevokeReview(record, onActionComplete),
      hidden: !isInitiatorMode || !canRevoke,
    },
    {
      type: moreType === 'default' ? 'default' : 'link',
      children: '归档',
      isDelete: false,
      message: getArchiveConfirmMessage(record),
      onClick: () => handleArchiveReview(record, onActionComplete),
      hidden: !isInitiatorMode || !canArchive,
    },
  ];

  return (
    <ButtonGroup
      moreType={moreType || 'link'}
      list={listArray}
      showLength={moreType === 'default' ? 2 : undefined}
    />
  );
};

export default ReviewActionButtons;
