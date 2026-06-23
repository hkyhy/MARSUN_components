import { CommonFilter, FilterDateRange, FilterInput, FilterTreeSelect } from '@/components/Common';
import React from 'react';
import type { UseAnalyticsFiltersReturn } from './hooks/useAnalyticsFilters';

interface AnalyticsFilterBarProps {
  filters: UseAnalyticsFiltersReturn;
}

const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({ filters }) => {
  const { dateRange, setDateRange, departmentId, setDepartmentId, keyword, setKeyword } = filters;

  return (
    <CommonFilter label="筛选">
      <FilterDateRange
        filterKey="dateRange"
        label="日期范围"
        value={dateRange}
        onChange={setDateRange}
      />
      <FilterTreeSelect
        filterKey="department"
        label="部门"
        value={departmentId}
        onChange={(v) => setDepartmentId(v as string | undefined)}
        showSearch
      />
      <FilterInput
        filterKey="keyword"
        label="姓名/工号"
        value={keyword || undefined}
        onChange={(v) => setKeyword(v ?? '')}
        placeholder="输入姓名或工号"
      />
    </CommonFilter>
  );
};

export default AnalyticsFilterBar;
