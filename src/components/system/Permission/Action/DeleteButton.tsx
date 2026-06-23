import { permissionApi } from '@/api';
import type { RoleConfig } from '@/types';
import { UserRole } from '@/types';
import { Button, Modal, message } from 'antd';
import React from 'react';
import { getRoleDisplayName } from '../utils/roleValidation';

interface DeleteButtonProps {
  role: RoleConfig;
  onSuccess: () => void;
}

/** 函数式调用供列表行操作使用 */
export function confirmDeleteRole(role: RoleConfig, onSuccess: () => void) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除角色「${getRoleDisplayName(role)}」吗？`,
    okType: 'danger',
    onOk: async () => {
      try {
        await permissionApi.deleteRole(role.key);
        message.success('删除成功');
        onSuccess();
      } catch {
        /* handled */
      }
    },
  });
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ role, onSuccess }) => {
  if (role.key === UserRole.SYSTEM_ADMIN) return null;

  return (
    <Button type="link" size="small" danger onClick={() => confirmDeleteRole(role, onSuccess)}>
      删除
    </Button>
  );
};

export default DeleteButton;
