/* eslint-disable @typescript-eslint/no-explicit-any */
import { agentHubApi } from '@/api';
import type { ChatAssistant, Dataset } from '@/types';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';

export const useChat = () => {
  const [data, setData] = useState<ChatAssistant[]>([]);
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [keyword, setKeyword] = useState('');

  const fetchDatasets = useCallback(async () => {
    try {
      const res = (await agentHubApi.listDatasets()) as any;
      // datasets: { code, data: [...], total_datasets }
      const list: Dataset[] = Array.isArray(res?.data) ? res.data : [];
      setDatasets(list);
    } catch {
      // handled
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await agentHubApi.listChats({
        ...(keyword ? { name: keyword } : {}),
      })) as any;
      // chats: { code, data: { chats: [...], total }, message }
      const list: ChatAssistant[] = res?.data?.chats ?? (Array.isArray(res?.data) ? res.data : []);
      setData(Array.isArray(list) ? list : []);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteChat = useCallback(
    async (id: string) => {
      await agentHubApi.deleteChat(id);
      message.success('助手已删除');
      fetchData();
    },
    [fetchData],
  );

  return {
    data,
    loading,
    datasets,
    keyword,
    setKeyword,
    fetchData,
    deleteChat,
  };
};
