import { CommonFilter, FilterDateRange, FilterSelect } from '@/components/Common';
import { AUDIT_ACTION_OPTIONS } from '@/constants';
import React, { useCallback } from 'react';

interface FilterBarProps {
  action?: string;
  dateRange: [string, string] | null;
  onActionChange: (value: string | undefined) => void;
  onDateRangeChange: (range: [string, string] | null) => void;
}

/** 审计日志筛选栏 */
const FilterBar: React.FC<FilterBarProps> = ({
  action,
  dateRange,
  onActionChange,
  onDateRangeChange,
}) => {
  const handleActionChange = useCallback(
    (value: string | number | undefined) => {
      onActionChange(value as string | undefined);
    },
    [onActionChange],
  );

  const filterList = [
    <FilterDateRange
      key="dateRange"
      filterKey="dateRange"
      label="日期范围"
      value={
        dateRange
          ? ([dateRange[0]!.split(' ')[0], dateRange[1]!.split(' ')[0]] as [string, string])
          : null
      }
      onChange={onDateRangeChange}
      showQuickOptions={false}
    />,
    <FilterSelect
      key="action"
      filterKey="action"
      label="操作类型"
      options={AUDIT_ACTION_OPTIONS}
      value={action}
      onChange={handleActionChange}
      searchable
    />,
  ];

  return <CommonFilter label="筛选" list={filterList} />;
};

export default FilterBar;
