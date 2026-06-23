import { feedbackApi } from '@/api';
import { useAuthStore } from '@/stores/authStore';
import type { FeedbackItem } from '@/types';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';

/** 反馈列表状态管理 Hook */
export function useFeedbackList() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [data, setData] = useState<FeedbackItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [deptFilter, setDeptFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, pageSize: 20 };
      if (activeTab !== 'all') params.status = activeTab;
      if (deptFilter) params.departmentId = deptFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = (await feedbackApi.list(params)) as unknown as {
        data: { list: FeedbackItem[]; total: number };
      };
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, deptFilter, categoryFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(1);
  };

  const handleDeptFilterChange = (value: string | undefined) => {
    setDeptFilter(value);
    setPage(1);
  };

  const handleCategoryFilterChange = (value: string | undefined) => {
    setCategoryFilter(value);
    setPage(1);
  };

  /** 处理反馈（标记处理中，若无负责人则自动指定为当前用户） */
  const handleProcess = useCallback(
    async (record: FeedbackItem) => {
      try {
        if (!record.assigneeId) {
          await feedbackApi.update(record.id, {
            action: 'ASSIGN',
            assigneeId: useAuthStore.getState().user?.id,
          });
        }
        await feedbackApi.update(record.id, { action: 'PROCESS' });
        message.success('已标记为处理中');
        fetchData();
      } catch {
        // handled
      }
    },
    [fetchData],
  );

  /** 重新打开反馈 */
  const handleReopen = useCallback(
    async (record: FeedbackItem) => {
      try {
        await feedbackApi.update(record.id, { action: 'REOPEN' });
        message.success('反馈已重新打开');
        fetchData();
      } catch {
        // handled
      }
    },
    [fetchData],
  );

  return {
    // 列表数据
    activeTab,
    data,
    total,
    loading,
    page,
    deptFilter,
    categoryFilter,
    // 操作方法
    setPage,
    handleTabChange,
    handleDeptFilterChange,
    handleCategoryFilterChange,
    handleProcess,
    handleReopen,
    fetchData,
  };
}
