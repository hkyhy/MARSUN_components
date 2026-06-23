import { CommonFilter, FilterSelect, FilterTreeSelect } from '@/components/Common';
import React from 'react';
import { CATEGORY_OPTIONS } from '../constants';

interface FilterBarProps {
  deptFilter?: string;
  categoryFilter?: string;
  onDeptChange: (value: string | undefined) => void;
  onCategoryChange: (value: string | undefined) => void;
}

/** 筛选栏 */
const FilterBar: React.FC<FilterBarProps> = ({
  deptFilter,
  categoryFilter,
  onDeptChange,
  onCategoryChange,
}) => {
  const filterList = [
    <FilterTreeSelect
      key="dept"
      filterKey="dept"
      label="部门"
      value={deptFilter}
      onChange={(v) => onDeptChange(v as string | undefined)}
      showSearch
    />,
    <FilterSelect
      key="category"
      filterKey="category"
      label="分类"
      options={CATEGORY_OPTIONS}
      value={categoryFilter}
      onChange={(v) => onCategoryChange(v as string | undefined)}
    />,
  ];

  return <CommonFilter label="筛选" list={filterList} />;
};

export default FilterBar;
