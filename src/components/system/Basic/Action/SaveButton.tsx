import { LoadingButton } from '@kne/button-group';
import React from 'react';

interface SaveButtonProps {
  loading?: boolean;
  onClick: () => void;
}

/** 保存设置按钮 */
const SaveButton: React.FC<SaveButtonProps> = ({ loading, onClick }) => (
  <LoadingButton type="primary" loading={loading} onClick={onClick}>
    保存设置
  </LoadingButton>
);

export default SaveButton;
