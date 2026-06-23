import type { FileItem } from '@/types';
import { ConfirmButton } from '@kne/button-group';
import React from 'react';
import { handleRevokeReview } from './handlers';

interface RevokeReviewButtonProps {
  record: FileItem;
  onSuccess: () => void;
}

/** 撤回审核按钮（ConfirmButton 形式，供页面头部等非 Table 场景使用） */
const RevokeReviewButton: React.FC<RevokeReviewButtonProps> = ({ record, onSuccess }) => {
  return (
    <ConfirmButton
      message={`确定要撤销「${record.name}」的审核吗？`}
      onClick={() => handleRevokeReview(record, onSuccess)}
    >
      撤销审核
    </ConfirmButton>
  );
};

export default RevokeReviewButton;
