import { CommonFilter, FilterDateRange, FilterInput, FilterSelect } from '@/components/Common';
import {
  ASSESSMENT_TASK_STATUS_OPTIONS,
  QUALITY_LEVEL_OPTIONS,
} from '@/components/TaskManagement/constants/status';
import type { AssessmentTaskStatus, QualityLevel } from '@/types';
import React from 'react';

interface FilterBarProps {
  keyword?: string;
  status?: AssessmentTaskStatus;
  level?: QualityLevel;
  dateRange: [string, string] | null;
  onKeywordChange: (value: string | undefined) => void;
  onStatusChange: (value: AssessmentTaskStatus | undefined) => void;
  onLevelChange: (value: QualityLevel | undefined) => void;
  onDateRangeChange: (range: [string, string] | null) => void;
}

/** 任务管理筛选栏 */
const FilterBar: React.FC<FilterBarProps> = ({
  keyword,
  status,
  level,
  dateRange,
  onKeywordChange,
  onStatusChange,
  onLevelChange,
  onDateRangeChange,
}) => {
  const filterList = [
    <FilterInput
      key="keyword"
      filterKey="keyword"
      label="文件名"
      value={keyword}
      onChange={onKeywordChange}
      placeholder="搜索文件名"
    />,
    <FilterSelect
      key="status"
      filterKey="status"
      label="任务状态"
      options={ASSESSMENT_TASK_STATUS_OPTIONS}
      value={status}
      onChange={(v) => onStatusChange(v as AssessmentTaskStatus | undefined)}
    />,
    <FilterSelect
      key="level"
      filterKey="level"
      label="质量等级"
      options={QUALITY_LEVEL_OPTIONS}
      value={level}
      onChange={(v) => onLevelChange(v as QualityLevel | undefined)}
    />,
    <FilterDateRange
      key="dateRange"
      filterKey="dateRange"
      label="创建日期"
      value={
        dateRange
          ? ([dateRange[0]!.split(' ')[0], dateRange[1]!.split(' ')[0]] as [string, string])
          : null
      }
      onChange={onDateRangeChange}
      showQuickOptions={false}
    />,
  ];

  return <CommonFilter label="筛选" list={filterList} />;
};

export default FilterBar;
