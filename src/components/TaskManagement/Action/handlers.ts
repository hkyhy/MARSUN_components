import { assessmentTaskApi } from '@/api';
import type { AssessmentTaskItem } from '@/types';
import { message } from 'antd';

export async function handleRerunTask(
  task: AssessmentTaskItem,
  onSuccess?: () => void,
): Promise<void> {
  await assessmentTaskApi.rerun(task.id);
  message.success('任务已重新入队');
  onSuccess?.();
}

export async function handleCancelTask(
  task: AssessmentTaskItem,
  onSuccess?: () => void,
): Promise<void> {
  await assessmentTaskApi.cancel(task.id);
  message.success('任务已取消');
  onSuccess?.();
}

export async function handleDeleteTask(
  task: AssessmentTaskItem,
  onSuccess?: () => void,
): Promise<void> {
  await assessmentTaskApi.delete(task.id);
  message.success('任务已删除');
  onSuccess?.();
}

export async function handleCreateTask(
  fileId: string,
  onSuccess?: () => void,
): Promise<void> {
  await assessmentTaskApi.create(fileId);
  message.success('任务已创建');
  onSuccess?.();
}
