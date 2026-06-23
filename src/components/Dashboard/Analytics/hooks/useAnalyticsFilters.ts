import type { StatsFilterParams } from '@/types';
import { useCallback, useMemo, useState } from 'react';

export interface AnalyticsFilterState {
  dateRange: [string, string] | null;
  departmentId?: string;
  keyword: string;
}

export function toStatsFilterParams(state: AnalyticsFilterState): StatsFilterParams {
  const params: StatsFilterParams = {};
  if (state.dateRange) {
    params.startDate = `${state.dateRange[0]} 00:00:00`;
    params.endDate = `${state.dateRange[1]} 23:59:59`;
  }
  if (state.departmentId) params.departmentId = state.departmentId;
  if (state.keyword.trim()) params.keyword = state.keyword.trim();
  return params;
}

export function useAnalyticsFilters() {
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [departmentId, setDepartmentId] = useState<string | undefined>();
  const [keyword, setKeyword] = useState('');

  const filterState: AnalyticsFilterState = { dateRange, departmentId, keyword };
  const filterParams = useMemo(
    () => toStatsFilterParams(filterState),
    [dateRange, departmentId, keyword],
  );

  const resetFilters = useCallback(() => {
    setDateRange(null);
    setDepartmentId(undefined);
    setKeyword('');
  }, []);

  return {
    filterState,
    filterParams,
    dateRange,
    setDateRange,
    departmentId,
    setDepartmentId,
    keyword,
    setKeyword,
    resetFilters,
  };
}

export type UseAnalyticsFiltersReturn = ReturnType<typeof useAnalyticsFilters>;
