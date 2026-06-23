import { agentHubApi } from '@/api';
import { message } from 'antd';

export const deleteDataset = async (id: string, onSuccess?: () => void) => {
  await agentHubApi.deleteDataset(id);
  message.success('知识库已删除');
  onSuccess?.();
};
