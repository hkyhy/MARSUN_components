import { ConfirmButton } from '@kne/button-group';
import React from 'react';
import { handleBatchDelete } from './handlers';

interface BatchDeleteButtonProps {
  selectedKeys: React.Key[];
  onSuccess: () => void;
}

/** 批量删除按钮（ConfirmButton 形式，供页面头部使用） */
const BatchDeleteButton: React.FC<BatchDeleteButtonProps> = ({ selectedKeys, onSuccess }) => {
  return (
    <ConfirmButton
      isDelete
      message={`确定要删除选中的 ${selectedKeys.length} 个项目吗？`}
      onClick={() => handleBatchDelete(selectedKeys, onSuccess)}
    >
      {`批量删除 (${selectedKeys.length})`}
    </ConfirmButton>
  );
};

export default BatchDeleteButton;
