import { auditApi } from '@/api';
import type { AuditLogItem } from '@/types';
import { toDateTimeRange } from '@/utils/date';
import { useCallback, useEffect, useState } from 'react';

/** 审计日志列表状态管理 Hook */
export function useAuditLogList() {
  const [data, setData] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, pageSize: 20 };
      if (action) params.action = action;
      if (dateRange) {
        params.startDate = dateRange[0];
        params.endDate = dateRange[1];
      }

      const res = (await auditApi.list(params)) as unknown as {
        data: { list: AuditLogItem[]; total: number };
      };
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, action, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleActionChange = useCallback((value: string | undefined) => {
    setAction(value);
    setPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range: [string, string] | null) => {
    setDateRange(toDateTimeRange(range));
    setPage(1);
  }, []);

  const exportParams: Record<string, string> = {};
  if (action) exportParams.action = action;
  if (dateRange) {
    exportParams.startDate = dateRange[0];
    exportParams.endDate = dateRange[1];
  }

  return {
    data,
    total,
    loading,
    page,
    action,
    dateRange,
    exportParams,
    setPage,
    handleActionChange,
    handleDateRangeChange,
  };
}
