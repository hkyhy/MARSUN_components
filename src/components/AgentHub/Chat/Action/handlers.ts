import { agentHubApi } from '@/api';
import { message } from 'antd';

export const deleteChat = async (id: string, onSuccess?: () => void) => {
  await agentHubApi.deleteChat(id);
  message.success('助手已删除');
  onSuccess?.();
};
