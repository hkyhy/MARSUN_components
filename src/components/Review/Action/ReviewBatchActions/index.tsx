import type { ReviewListItem } from '@/types';
import { BATCH_ACTIONABLE_STATUSES } from '../handlers';
import ButtonGroup from '@kne/button-group';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ReviewBatchActionsProps {
  selectedRowKeys: React.Key[];
  selectedRows: ReviewListItem[];
  onBatchAction: (action: 'approve' | 'reject' | 'return') => void;
}

/** 审核列表上方批量操作按钮（批量通过、批量驳回、批量退回） */
const ReviewBatchActions: React.FC<ReviewBatchActionsProps> = ({
  selectedRowKeys,
  selectedRows,
  onBatchAction,
}) => {
  const hasSelected = selectedRowKeys.length > 0;
  const allActionable =
    hasSelected &&
    selectedRows.length > 0 &&
    selectedRows.every((r) => BATCH_ACTIONABLE_STATUSES.includes(r.reviewStatus as never));

  const listArray: Record<string, unknown>[] = [
    {
      children: `批量通过${hasSelected ? `(${selectedRowKeys.length})` : ''}`,
      type: 'primary',
      size: 'small',
      disabled: !allActionable,
      onClick: () => onBatchAction('approve'),
    },
    {
      children: `批量驳回${hasSelected ? `(${selectedRowKeys.length})` : ''}`,
      size: 'small',
      danger: true,
      disabled: !allActionable,
      onClick: () => onBatchAction('reject'),
    },
    {
      children: `批量退回${hasSelected ? `(${selectedRowKeys.length})` : ''}`,
      size: 'small',
      disabled: !allActionable,
      onClick: () => onBatchAction('return'),
    },
  ];

  return (
    <div className={classNames('review-batch-actions-empty', styles['review-batch-actions-empty'])}>
      <ButtonGroup list={listArray} />
    </div>
  );
};

export default ReviewBatchActions;
