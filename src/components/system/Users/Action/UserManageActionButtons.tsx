import ButtonGroup from '@kne/button-group';
import React from 'react';

interface UserManageActionButtonsProps {
  canCreate: boolean;
  onAdd: () => void;
  onImport: () => void;
}

/** 用户管理页头部操作按钮（添加 + 批量导入） */
const UserManageActionButtons: React.FC<UserManageActionButtonsProps> = ({
  canCreate,
  onAdd,
  onImport,
}) => {
  if (!canCreate) return null;

  const listArray: Record<string, unknown>[] = [
    {
      children: '添加用户',
      type: 'primary',
      onClick: onAdd,
    },
    {
      children: '批量导入',
      onClick: onImport,
    },
  ];

  return <ButtonGroup showLength={2} list={listArray} />;
};

export default UserManageActionButtons;
