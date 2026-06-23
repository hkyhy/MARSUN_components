import { userApi } from '@/api';
import type { UserInfo } from '@/types';
import { Trash2 } from '@/icons';
import { Button, Modal, message } from 'antd';
import React from 'react';

interface DeleteUserButtonProps {
  user: UserInfo;
  onSuccess: () => void;
}

/** 保留函数式调用供列表行操作使用 */
export function confirmDeleteUser(user: UserInfo, onSuccess: () => void) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户「${user.displayName}」吗？删除后账号将变为已删除状态，且无法登录。`,
    okType: 'danger',
    onOk: async () => {
      try {
        await userApi.delete(user.id);
        message.success('删除成功');
        onSuccess();
      } catch {
        /* handled */
      }
    },
  });
}

/** 删除用户按钮（确认弹窗） */
const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ user, onSuccess }) => {
  return (
    <Button danger icon={<Trash2 />} onClick={() => confirmDeleteUser(user, onSuccess)}>
      删除
    </Button>
  );
};

export default DeleteUserButton;
