import { hasPermission } from '@/components/Common/Auth';
import { useAuthStore } from '@/stores/authStore';
import type { FileItem } from '@/types';
import { ReviewStatus, UserRole } from '@/types';
import ButtonGroup from '@kne/button-group';
import React from 'react';
import { getDeleteConfirmMessage, handleArchive, handleDelete } from './handlers';

interface FolderActionButtonsProps {
  record: FileItem;
  canOperate: boolean;
  onRename: (record: FileItem) => void;
  onMove?: (record: FileItem) => void;
  onRefresh: () => void | Promise<void>;
}

const FolderActionButtons: React.FC<FolderActionButtonsProps> = ({
  record,
  canOperate,
  onRename,
  onMove,
  onRefresh,
}) => {
  const { hasAnyRole, user } = useAuthStore();
  const isSystemAdmin = hasAnyRole([UserRole.SYSTEM_ADMIN]);
  const canRename = hasPermission(user, 'file:rename');
  const canDelete = hasPermission(user, 'file:delete');

  const isSystemFolder = record.isDepartmentFolder === true;
  const isArchived = record.reviewStatus === ReviewStatus.ARCHIVED;
  const canMutate = canOperate && !isSystemFolder;

  const listArray: Record<string, unknown>[] = [
    {
      type: 'link',
      children: '重命名',
      onClick: () => onRename(record),
      hidden: !canMutate || !canRename,
    },
    {
      type: 'link',
      children: '移动到',
      onClick: () => onMove?.(record),
      hidden: !canMutate || !onMove || !canRename,
    },
    {
      type: 'link',
      children: '归档',
      isDelete: false,
      message: `确定要归档文件夹「${record.name}」吗？归档后文件夹将变为只读状态。`,
      onClick: () => handleArchive(record, onRefresh),
      hidden: !isSystemAdmin || !canMutate || isArchived,
    },
    {
      type: 'link',
      children: '删除',
      isDelete: true,
      message: getDeleteConfirmMessage(record),
      onClick: () => handleDelete(record, onRefresh),
      hidden: !canMutate || isArchived || !canDelete,
    },
  ];

  if (listArray.every((item) => item.hidden)) return null;

  return <ButtonGroup moreType="link" list={listArray} />;
};

export default FolderActionButtons;
