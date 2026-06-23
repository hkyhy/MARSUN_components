import { useAuthStore } from '@/stores/authStore';
import type { FileItem } from '@/types';
import { UserRole } from '@/types';
import ButtonGroup from '@kne/button-group';
import React from 'react';
import {
  ARCHIVE_STATUSES,
  DELETE_STATUSES,
  handleBatchArchive,
  handleBatchDelete,
  handleBatchRevokeReview,
  handleBatchSubmitReview,
  REVOKE_REVIEW_STATUSES,
  SUBMIT_REVIEW_STATUSES,
} from '../handlers';
import styles from './style.module.scss';
import classNames from 'classnames';

interface HeaderActionsProps {
  onUpload: () => void;
  onCreateFolder?: () => void;
  onUploadFolder?: () => void;
}

/** 页面头部操作按钮（上传文件、上传文件夹、新建文件夹） */
export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onUpload,
  onCreateFolder,
  onUploadFolder,
}) => {
  const { hasAnyRole } = useAuthStore();
  const isSystemAdmin = hasAnyRole([UserRole.SYSTEM_ADMIN]);

  const listArray: Record<string, unknown>[] = [
    {
      children: '上传文件',
      type: 'primary',
      onClick: onUpload,
    },
    {
      children: '上传文件夹',
      onClick: onUploadFolder,
      hidden: !isSystemAdmin || !onUploadFolder,
    },
    {
      children: '新建文件夹',
      onClick: onCreateFolder,
      hidden: !isSystemAdmin || !onCreateFolder,
    },
  ];

  return <ButtonGroup showLength={3} list={listArray} />;
};

interface BatchActionsProps {
  hasAnyRole: (roles: UserRole[]) => boolean;
  selectedRowKeys: React.Key[];
  selectedRows: FileItem[];
  onBatchSuccess: () => void;
}

/** 表格上方批量操作按钮（提交审核、撤销审核、归档、删除） */
export const BatchActions: React.FC<BatchActionsProps> = ({
  hasAnyRole,
  selectedRowKeys,
  selectedRows,
  onBatchSuccess,
}) => {
  const hasSelected = selectedRowKeys.length > 0;
  // 由于同类型限制，所有选中项状态一致，只需检查第一个
  const anchorStatus = selectedRows.length > 0 ? selectedRows[0]?.reviewStatus : undefined;

  const canSubmit =
    hasSelected && anchorStatus !== undefined && SUBMIT_REVIEW_STATUSES.includes(anchorStatus);
  const canRevoke =
    hasSelected && anchorStatus !== undefined && REVOKE_REVIEW_STATUSES.includes(anchorStatus);
  const canDelete =
    hasSelected && anchorStatus !== undefined && DELETE_STATUSES.includes(anchorStatus);
  const canArchive =
    hasSelected && anchorStatus !== undefined && ARCHIVE_STATUSES.includes(anchorStatus);

  const listArray: Record<string, unknown>[] = [
    {
      children: `批量提交审核${hasSelected ? ` (${selectedRowKeys.length})` : ''}`,
      disabled: !canSubmit,
      size: 'small',
      onClick: () => {
        if (!canSubmit) return;
        handleBatchSubmitReview(selectedRowKeys as string[], onBatchSuccess);
      },
    },
    {
      children: `批量撤销审核${hasSelected ? ` (${selectedRowKeys.length})` : ''}`,
      disabled: !canRevoke,
      size: 'small',
      onClick: () => {
        if (!canRevoke) return;
        handleBatchRevokeReview(selectedRowKeys as string[], onBatchSuccess);
      },
    },
    {
      children: `批量归档${hasSelected ? ` (${selectedRowKeys.length})` : ''}`,
      disabled: !canArchive,
      size: 'small',
      onClick: () => {
        if (!canArchive) return;
        handleBatchArchive(selectedRowKeys as string[], onBatchSuccess);
      },
      hidden: !hasAnyRole([UserRole.SYSTEM_ADMIN]),
    },
    {
      children: `批量删除${hasSelected ? ` (${selectedRowKeys.length})` : ''}`,
      danger: true,
      disabled: !canDelete,
      isDelete: true,
      size: 'small',
      message: `确定要删除选中的 ${selectedRowKeys.length} 个项目吗？`,
      onClick: () => handleBatchDelete(selectedRowKeys as string[], onBatchSuccess),
    },
  ];

  return (
    <div className={classNames('file-manager-actions-thumb', styles['file-manager-actions-thumb'])}>
      <ButtonGroup list={listArray} showLength={4} />
    </div>
  );
};

/** @deprecated 使用 HeaderActions + BatchActions 替代 */
const FileManagerActions: React.FC<HeaderActionsProps & BatchActionsProps> = (props) => {
  return (
    <>
      <HeaderActions onUpload={props.onUpload} onCreateFolder={props.onCreateFolder} />
      <BatchActions
        hasAnyRole={props.hasAnyRole}
        selectedRowKeys={props.selectedRowKeys}
        selectedRows={props.selectedRows}
        onBatchSuccess={props.onBatchSuccess}
      />
    </>
  );
};

export default FileManagerActions;
