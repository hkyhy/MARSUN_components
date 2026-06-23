import { assessmentTaskApi } from '@/api';
import type { AssessmentTaskItem, AssessmentTaskStatus, QualityLevel } from '@/types';
import { toDateTimeRange } from '@/utils/date';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTaskListOptions {
  pollInterval?: number;
}

/** 任务列表状态管理 Hook */
export function useTaskList(options: UseTaskListOptions = {}) {
  const { pollInterval = 10000 } = options;
  const [data, setData] = useState<AssessmentTaskItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AssessmentTaskStatus | undefined>();
  const [level, setLevel] = useState<QualityLevel | undefined>();
  const [keyword, setKeyword] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, pageSize: 20 };
      if (status) params.status = status;
      if (level) params.level = level;
      if (keyword) params.keyword = keyword;
      if (dateRange) {
        params.startDate = dateRange[0];
        params.endDate = dateRange[1];
      }

      const res = (await assessmentTaskApi.list(params)) as unknown as {
        data: { list: AssessmentTaskItem[]; total: number };
      };
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, status, level, keyword, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(fetchData, pollInterval);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchData, pollInterval]);

  const handleStatusChange = useCallback((value: AssessmentTaskStatus | undefined) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleLevelChange = useCallback((value: QualityLevel | undefined) => {
    setLevel(value);
    setPage(1);
  }, []);

  const handleKeywordChange = useCallback((value: string | undefined) => {
    setKeyword(value);
    setPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range: [string, string] | null) => {
    setDateRange(toDateTimeRange(range));
    setPage(1);
  }, []);

  const hasActiveTasks = data.some((t) => t.status === 'PENDING' || t.status === 'RUNNING');

  return {
    data,
    total,
    loading,
    page,
    setPage,
    status,
    level,
    keyword,
    dateRange,
    fetchData,
    hasActiveTasks,
    handleStatusChange,
    handleLevelChange,
    handleKeywordChange,
    handleDateRangeChange,
  };
}
