import type { FileItem } from '@/types';
import { ConfirmButton } from '@kne/button-group';
import React from 'react';
import { getDeleteConfirmMessage, handleDelete } from './handlers';

interface DeleteButtonProps {
  record: FileItem;
  onSuccess: () => void;
}

/** 删除按钮（ConfirmButton 形式，供页面头部等非 Table 场景使用） */
const DeleteButton: React.FC<DeleteButtonProps> = ({ record, onSuccess }) => {
  return (
    <ConfirmButton
      isDelete
      message={getDeleteConfirmMessage(record)}
      onClick={() => handleDelete(record, onSuccess)}
    >
      删除
    </ConfirmButton>
  );
};

export default DeleteButton;
