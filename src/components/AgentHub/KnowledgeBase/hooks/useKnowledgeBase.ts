/* eslint-disable @typescript-eslint/no-explicit-any */
import { agentHubApi } from '@/api';
import type { Dataset } from '@/types';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';

export const useKnowledgeBase = () => {
  const [data, setData] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await agentHubApi.listDatasets({
        include_parsing_status: true,
        ...(keyword ? { name: keyword } : {}),
      })) as any;
      // datasets: { code, data: [...], total_datasets }
      const list: Dataset[] = Array.isArray(res?.data) ? res.data : [];
      setData(list);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteDataset = useCallback(
    async (id: string) => {
      await agentHubApi.deleteDataset(id);
      message.success('知识库已删除');
      fetchData();
    },
    [fetchData],
  );

  return {
    data,
    loading,
    keyword,
    setKeyword,
    fetchData,
    deleteDataset,
  };
};
