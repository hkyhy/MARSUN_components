import { fileApi, reviewApi } from '@/api';
import type { ReviewListItem } from '@/types';
import { ReviewStatus } from '@/types';
import { message } from 'antd';

/** 批量操作允许的审核状态（仅待审核/审核中状态可批量操作） */
export const BATCH_ACTIONABLE_STATUSES: ReviewStatus[] = [
  ReviewStatus.PENDING_REVIEWER,
  ReviewStatus.REVIEWING_REVIEWER,
  ReviewStatus.PENDING_SECOND_REVIEWER,
  ReviewStatus.REVIEWING_SECOND_REVIEWER,
];

/** 获取文件的 fileId（兼容不同列表返回的 id/fileId） */
export function getFileId(record: ReviewListItem): string | undefined {
  return record.fileId || record.id;
}

/** 提交审核 */
export async function handleSubmitReview(record: ReviewListItem, onSuccess: () => void) {
  const fileId = getFileId(record);
  if (!fileId) return;
  try {
    await fileApi.submitReview(fileId);
    message.success('提交审核成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 撤销审核 */
export async function handleRevokeReview(record: ReviewListItem, onSuccess: () => void) {
  const fileId = getFileId(record);
  if (!fileId) return;
  try {
    await fileApi.revokeReview(fileId);
    message.success('撤销审核成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 审核通过 */
export async function handleApprove(
  record: ReviewListItem,
  values: { needSecondReview?: boolean; secondReviewerId?: string; comment?: string },
  onSuccess: () => void,
) {
  const fileId = getFileId(record);
  if (!fileId) return;
  try {
    await reviewApi.submit(fileId, {
      action: 'APPROVE',
      needSecondReview: values.needSecondReview,
      secondReviewerId: values.secondReviewerId,
      comment: values.comment,
    });
    message.success('已通过');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 审核驳回 */
export async function handleReject(
  record: ReviewListItem,
  values: { reason: string; comment?: string },
  onSuccess: () => void,
) {
  const fileId = getFileId(record);
  if (!fileId) return;
  try {
    await reviewApi.submit(fileId, {
      action: 'REJECT',
      reason: values.reason,
      comment: values.comment,
    });
    message.success('已驳回');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 退回修改 */
export async function handleReturn(
  record: ReviewListItem,
  values: { reason: string; comment?: string },
  onSuccess: () => void,
) {
  const fileId = getFileId(record);
  if (!fileId) return;
  try {
    await reviewApi.submit(fileId, {
      action: 'RETURN',
      reason: values.reason,
      comment: values.comment,
    });
    message.success('已退回修改');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 转审 */
export async function handleTransfer(
  record: ReviewListItem,
  values: { transferToId: string; reason: string },
  onSuccess: () => void,
) {
  const fileId = getFileId(record);
  if (!fileId) return;
  try {
    await reviewApi.transfer(fileId, values);
    message.success('转审成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 重新上传 */
export async function handleReupload(record: ReviewListItem, file: File, onSuccess: () => void) {
  const fileId = getFileId(record);
  if (!fileId) return;
  try {
    const formData = new FormData();
    formData.append('file', file);
    await fileApi.reupload(fileId, formData);
    message.success('重新上传成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 获取提交审核确认消息 */
export function getSubmitConfirmMessage(record: ReviewListItem) {
  return `确定要提交「${record.fileName || record.name}」进行审核吗？`;
}

/** 获取撤销审核确认消息 */
export function getRevokeConfirmMessage(record: ReviewListItem) {
  return `确定要撤销「${record.fileName || record.name}」的审核吗？`;
}

/** 释放审核（REVIEWING → 回退到 PENDING_*） */
export async function handleReleaseReview(record: ReviewListItem, onSuccess: () => void) {
  const fileId = getFileId(record);
  if (!fileId) return;
  try {
    await reviewApi.release(fileId);
    message.success('已释放审核任务');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 获取释放审核确认消息 */
export function getReleaseConfirmMessage(record: ReviewListItem) {
  return `确定要释放「${record.fileName || record.name}」的审核任务吗？释放后其他人可以处理该文件。`;
}

/** 归档（审核通过后） */
export async function handleArchiveReview(record: ReviewListItem, onSuccess: () => void) {
  const fileId = getFileId(record);
  if (!fileId) return;
  try {
    await fileApi.archive(fileId);
    message.success('归档成功');
    onSuccess();
  } catch {
    /* handled */
  }
}

/** 获取归档确认消息 */
export function getArchiveConfirmMessage(record: ReviewListItem) {
  return `确定要归档「${record.fileName || record.name}」吗？归档后文件将变为只读状态。`;
}

/** 批量审核 */
export async function handleBatchReview(
  fileIds: string[],
  action: 'APPROVE' | 'REJECT' | 'RETURN',
  values: Record<string, unknown>,
  onSuccess: () => void,
) {
  try {
    await reviewApi.batchReview({
      fileIds,
      action,
      needSecondReview:
        action === 'APPROVE' ? (values.needSecondReview as boolean) || false : undefined,
      secondReviewerId: action === 'APPROVE' ? (values.secondReviewerId as string) : undefined,
      comment: values.comment as string,
      reason: action !== 'APPROVE' ? (values.reason as string) : undefined,
    });
    message.success('批量审核完成');
    onSuccess();
  } catch {
    /* handled */
  }
}
