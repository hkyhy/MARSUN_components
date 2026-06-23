import { fileApi } from '@/api';
import { useAuthStore } from '@/stores/authStore';
import type { FileItem } from '@/types';
import { ReviewStatus, UserRole } from '@/types';
import { downloadFileItem, getFileDownloadUrl } from '@/utils/Files';
import { message } from 'antd';

/** 判断当前用户是否可以操作指定文件 */
export function canOperate(record: FileItem): boolean {
  const { user, hasAnyRole } = useAuthStore.getState();
  if (hasAnyRole([UserRole.SYSTEM_ADMIN])) return true;
  // 文件夹操作仅系统管理员可执行
  if (record.type === 'FOLDER') return false;
  // 部门领导可查看本部门及子部门文件，但只能操作本人上传的文件
  return record.uploaderId === user?.id;
}

/** 删除单个文件/文件夹 */
export async function handleDelete(record: FileItem, onSuccess: () => void) {
  try {
    await fileApi.delete(record.id);
    message.success('删除成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 提交审核 */
export async function handleSubmitReview(record: FileItem, onSuccess: () => void) {
  try {
    await fileApi.submitReview(record.id);
    message.success('提交审核成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 撤回审核 */
export async function handleRevokeReview(record: FileItem, onSuccess: () => void) {
  try {
    await fileApi.revokeReview(record.id);
    message.success('撤销审核成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 归档文件/文件夹 */
export async function handleArchive(record: FileItem, onSuccess: () => void) {
  try {
    await fileApi.archive(record.id);
    message.success('归档成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 批量删除 */
export async function handleBatchDelete(selectedKeys: React.Key[], onSuccess: () => void) {
  try {
    await fileApi.batchDelete(selectedKeys as string[]);
    message.success('批量删除成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 批量提交审核 */
export async function handleBatchSubmitReview(ids: string[], onSuccess: () => void) {
  try {
    await fileApi.batchSubmitReview(ids);
    message.success('批量提交审核成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 批量撤销审核 */
export async function handleBatchRevokeReview(ids: string[], onSuccess: () => void) {
  try {
    await fileApi.batchRevokeReview(ids);
    message.success('批量撤销审核成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 批量归档 */
export async function handleBatchArchive(ids: string[], onSuccess: () => void) {
  try {
    await fileApi.batchArchive(ids);
    message.success('批量归档成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

// ── 批量操作的状态校验 ──

/** 可提交审核的状态 */
export const SUBMIT_REVIEW_STATUSES: ReviewStatus[] = [
  ReviewStatus.DRAFT,
  ReviewStatus.REJECTED,
  ReviewStatus.RETURNED,
  ReviewStatus.REVOKED,
];
/** 可撤销审核的状态 */
export const REVOKE_REVIEW_STATUSES: ReviewStatus[] = [
  ReviewStatus.PENDING_REVIEWER,
  ReviewStatus.REVIEWING_REVIEWER,
  ReviewStatus.PENDING_SECOND_REVIEWER,
  ReviewStatus.REVIEWING_SECOND_REVIEWER,
];
/** 可删除的状态 */
export const DELETE_STATUSES: ReviewStatus[] = [
  ReviewStatus.DRAFT,
  ReviewStatus.REJECTED,
  ReviewStatus.RETURNED,
  ReviewStatus.REVOKED,
];
/** 可归档的状态 */
export const ARCHIVE_STATUSES: ReviewStatus[] = [ReviewStatus.APPROVED];

/** 获取选中项中可执行某操作的项目，返回 [可操作的ids, 不可操作的count] */
export function filterByStatus(
  selectedRows: FileItem[],
  allowedStatuses: string[],
): [string[], number] {
  const operable: string[] = [];
  let inoperable = 0;
  for (const row of selectedRows) {
    if (allowedStatuses.includes(row.reviewStatus)) {
      operable.push(row.id);
    } else {
      inoperable++;
    }
  }
  return [operable, inoperable];
}

/** 创建文件夹 */
export async function handleCreateFolder(
  name: string,
  parentId: string | null,
  departmentId?: string,
  isPublic?: boolean,
  onSuccess?: () => void,
) {
  try {
    await fileApi.createFolder({ name, parentId, departmentId, isPublic });
    message.success('创建文件夹成功');
    onSuccess?.();
  } catch {
    /* handled */
  }
}

/** 重命名 */
export async function handleRenameSubmit(id: string, name: string, onSuccess?: () => void) {
  try {
    await fileApi.update(id, { name } as Partial<FileItem>);
    message.success('重命名成功');
    onSuccess?.();
  } catch {
    /* handled */
  }
}

/** 移动文件/文件夹 */
export async function handleMoveSubmit(
  id: string,
  targetFolderId: string | null,
  onSuccess?: () => void,
) {
  try {
    await fileApi.move(id, targetFolderId);
    message.success('移动成功');
    onSuccess?.();
  } catch {
    /* handled */
  }
}

/** 下载文件 */
export async function handleDownloadFile(record: Pick<FileItem, 'id' | 'name'>) {
  const ok = await downloadFileItem(record);
  if (ok) return;

  const token = useAuthStore.getState().token;
  if (token) {
    window.open(getFileDownloadUrl(record.id), '_blank');
    return;
  }
  message.error('下载失败，请重新登录后重试');
}

/** 获取删除确认消息 */
export function getDeleteConfirmMessage(record: FileItem) {
  return record.type === 'FOLDER'
    ? `确定要删除文件夹「${record.name}」吗？仅可删除空文件夹，文件夹内有文件或子文件夹时将无法删除。`
    : `确定要删除「${record.name}」吗？`;
}
