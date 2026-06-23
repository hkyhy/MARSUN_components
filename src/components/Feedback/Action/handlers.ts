import { feedbackApi } from '@/api';
import type { FeedbackItem } from '@/types';
import { message, Modal } from 'antd';

/** 开始处理反馈 */
export async function handleProcess(id: string) {
  try {
    await feedbackApi.update(id, { action: 'PROCESS' });
    message.success('已标记为处理中');
    return true;
  } catch {
    return false;
  }
}

/** 处理完成（调用方需通过 ProcessCompleteModal 提交） */
export async function handleProcessComplete(id: string, resolution: string) {
  try {
    await feedbackApi.update(id, { action: 'PROCESSED', resolution });
    message.success('已标记为处理完成');
    return true;
  } catch {
    return false;
  }
}

/** 关闭反馈（调用方需通过 CloseModal 提交） */
export async function handleClose(id: string, resolution: string) {
  try {
    await feedbackApi.update(id, { action: 'CLOSE', resolution });
    message.success('反馈已关闭');
    return true;
  } catch {
    return false;
  }
}

/** 重新打开反馈 */
export async function handleReopen(id: string) {
  try {
    await feedbackApi.update(id, { action: 'REOPEN' });
    message.success('反馈已重新打开');
    return true;
  } catch {
    return false;
  }
}

/** 指定负责人 */
export async function handleAssign(id: string, assigneeId: string) {
  try {
    await feedbackApi.update(id, { action: 'ASSIGN', assigneeId });
    message.success('已指定负责人');
    return true;
  } catch {
    return false;
  }
}

/** 转交负责人 */
export async function handleTransfer(id: string, assigneeId: string, comment?: string) {
  try {
    await feedbackApi.update(id, { action: 'TRANSFER', assigneeId, comment });
    message.success('已转交负责人');
    return true;
  } catch {
    return false;
  }
}

/** 修改优先级（action 模式） */
export async function handlePriorityChange(id: string, priority: string) {
  try {
    await feedbackApi.update(id, { action: 'PRIORITY_CHANGE', priority });
    message.success('优先级已更新');
    return true;
  } catch {
    return false;
  }
}

/** 删除反馈确认弹窗 */
export function confirmDeleteFeedback(record: FeedbackItem, onSuccess: () => void) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除反馈「${record.title}」吗？删除后不可恢复。`,
    okType: 'danger',
    onOk: async () => {
      try {
        await feedbackApi.delete(record.id);
        message.success('删除成功');
        onSuccess();
      } catch {
        /* handled */
      }
    },
  });
}
