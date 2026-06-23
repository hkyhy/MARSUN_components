import { SemanticTag, TooltipInfo } from '@/components/Common';
import { getReviewFileExistenceStatus } from '@/constants';
import dayjs from 'dayjs';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ReviewFileStatusTagProps {
  deletedAt?: string | null;
  deletedByName?: string | null;
}

const formatDateTime = (value?: string | null) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-';

/** 审核列表文件存续状态（正常 / 文件已删除） */
const ReviewFileStatusTag: React.FC<ReviewFileStatusTagProps> = ({ deletedAt, deletedByName }) => {
  const { label, color } = getReviewFileExistenceStatus(deletedAt);

  return (
    <TooltipInfo
      hidden={!deletedAt}
      content={[
        { label: '删除人', value: deletedByName || '-' },
        { label: '删除时间', value: formatDateTime(deletedAt) },
      ]}
    >
      <SemanticTag color={color} className={deletedAt ? classNames('review-file-status-tag-clickable-tag', styles['review-file-status-tag-clickable-tag']) : undefined}>
        {label}
      </SemanticTag>
    </TooltipInfo>
  );
};

export default ReviewFileStatusTag;
