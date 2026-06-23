import { deptApi } from '@/api';
import type { Department } from '@/types';
import { Trash2 } from '@/icons';
import { Button, Modal, message } from 'antd';
import React from 'react';

interface DeleteButtonProps {
  dept: Pick<Department, 'id' | 'name'>;
  onSuccess: () => void;
}

/** 保留函数式调用供树节点内操作使用 */
export function confirmDeleteDept(dept: Pick<Department, 'id' | 'name'>, onSuccess: () => void) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除部门「${dept.name}」吗？`,
    okType: 'danger',
    onOk: async () => {
      try {
        await deptApi.delete(dept.id);
        message.success('删除成功');
        onSuccess();
      } catch {
        /* handled */
      }
    },
  });
}

/** 删除部门按钮（确认弹窗） */
const DeleteButton: React.FC<DeleteButtonProps> = ({ dept, onSuccess }) => {
  return (
    <Button
      type="text"
      size="small"
      danger
      icon={<Trash2 />}
      onClick={(e) => {
        e.stopPropagation();
        confirmDeleteDept(dept, onSuccess);
      }}
    />
  );
};

export default DeleteButton;
