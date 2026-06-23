import type { FileItem } from '@/types';
import { ConfirmButton } from '@kne/button-group';
import React from 'react';
import { handleSubmitReview } from './handlers';

interface SubmitReviewButtonProps {
  record: FileItem;
  onSuccess: () => void;
}

/** 提交审核按钮（ConfirmButton 形式，供页面头部等非 Table 场景使用） */
const SubmitReviewButton: React.FC<SubmitReviewButtonProps> = ({ record, onSuccess }) => {
  return (
    <ConfirmButton
      message={`确定要提交「${record.name}」进行审核吗？`}
      onClick={() => handleSubmitReview(record, onSuccess)}
    >
      提交审核
    </ConfirmButton>
  );
};

export default SubmitReviewButton;
