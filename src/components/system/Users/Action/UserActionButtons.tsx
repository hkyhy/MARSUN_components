import type { UserInfo } from '@/types';
import { MemberStatus, UserRole } from '@/types';
import ButtonGroup from '@kne/button-group';
import React from 'react';
import { confirmDeleteUser } from './DeleteUserButton';

interface UserActionButtonsProps {
  user: UserInfo;
  canEdit: boolean;
  canStatus: boolean;
  canDelete?: boolean;
  onEdit: () => void;
  onStatusChange: () => void;
  onActionComplete: () => void;
}

/** 用户详情页操作按钮（编辑 + 变更状态 + 删除） */
const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  user,
  canEdit,
  canStatus,
  canDelete,
  onEdit,
  onStatusChange,
  onActionComplete,
}) => {
  if (user.memberStatus === MemberStatus.DELETED) return null;
  if (!canEdit && !canStatus && !canDelete) return null;

  const listArray: Record<string, unknown>[] = [
    {
      children: '编辑',
      type: 'primary',
      onClick: onEdit,
      hidden: !canEdit,
    },
    {
      children: '变更状态',
      onClick: onStatusChange,
      hidden: !canStatus,
    },
    {
      children: '删除',
      isDelete: true,
      message: `确定要删除用户「${user.displayName}」吗？删除后账号将变为已删除状态，且无法登录。`,
      onClick: () => confirmDeleteUser(user, onActionComplete),
      hidden: !canDelete || user.role === UserRole.SYSTEM_ADMIN,
    },
  ];

  return <ButtonGroup showLength={3} list={listArray} />;
};

export default UserActionButtons;
