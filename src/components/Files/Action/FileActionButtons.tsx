import { hasPermission } from '@/components/Common/Auth';
import { useAuthStore } from '@/stores/authStore';
import type { FileItem } from '@/types';
import { UserRole } from '@/types';
import ButtonGroup from '@kne/button-group';
import React from 'react';
import {
  getDeleteConfirmMessage,
  handleArchive,
  handleDelete,
  handleDownloadFile,
  handleRevokeReview,
  handleSubmitReview,
} from './handlers';

interface FileActionButtonsProps {
  record: FileItem;
  canOperate: boolean;
  onRename: (record: FileItem) => void;
  onMove: (record: FileItem) => void;
  onReupload: (record: FileItem) => void;
  onRefresh: () => void | Promise<void>;
}

const FileActionButtons: React.FC<FileActionButtonsProps> = ({
  record,
  canOperate,
  onRename,
  onMove,
  onReupload,
  onRefresh,
}) => {
  const { hasAnyRole, user } = useAuthStore();
  const isSystemAdmin = hasAnyRole([UserRole.SYSTEM_ADMIN]);
  const canRename = hasPermission(user, 'file:rename');
  const canDelete = hasPermission(user, 'file:delete');
  const canMove = !hasAnyRole([UserRole.NORMAL_USER]) && hasPermission(user, 'file:rename');
  const isEditable =
    canOperate && ['DRAFT', 'REJECTED', 'RETURNED', 'REVOKED'].includes(record.reviewStatus);
  const isInReview =
    canOperate &&
    [
      'PENDING_REVIEWER',
      'REVIEWING_REVIEWER',
      'PENDING_SECOND_REVIEWER',
      'REVIEWING_SECOND_REVIEWER',
    ].includes(record.reviewStatus);
  const isApproved = canOperate && record.reviewStatus === 'APPROVED';

  const listArray: Record<string, unknown>[] = [
    {
      type: 'link',
      children: '下载',
      onClick: () => handleDownloadFile(record),
      hidden: record.type !== 'FILE',
    },
    {
      type: 'link',
      children: '重新上传',
      onClick: () => onReupload(record),
      hidden: !isEditable || record.type !== 'FILE',
    },
    {
      type: 'link',
      children: '重命名',
      onClick: () => onRename(record),
      hidden: !isEditable || !canRename,
    },
    {
      type: 'link',
      children: '移动到',
      onClick: () => onMove(record),
      hidden: !canMove || !(isEditable || isApproved),
    },
    {
      type: 'link',
      children: '提交审核',
      isDelete: false,
      message: `确定要提交「${record.name}」进行审核吗？`,
      onClick: () => handleSubmitReview(record, onRefresh),
      hidden: !isEditable,
    },
    {
      type: 'link',
      children: '撤销审核',
      message: `确定要撤销「${record.name}」的审核吗？`,
      isDelete: false,
      onClick: () => handleRevokeReview(record, onRefresh),
      hidden: !isInReview,
    },
    {
      type: 'link',
      children: '归档',
      isDelete: false,
      message: `确定要归档「${record.name}」吗？归档后文件将变为只读状态。`,
      onClick: () => handleArchive(record, onRefresh),
      hidden: !isApproved || !isSystemAdmin,
    },
    {
      type: 'link',
      children: '删除',
      isDelete: true,
      message: getDeleteConfirmMessage(record),
      onClick: () => handleDelete(record, onRefresh),
      hidden: !isEditable || !canDelete,
    },
  ];

  return <ButtonGroup moreType="link" list={listArray} />;
};

export default FileActionButtons;
