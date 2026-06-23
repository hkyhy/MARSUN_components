import { CommonFilter, FilterInput, FilterSelect, FilterTreeSelect } from '@/components/Common';
import { MEMBER_STATUS_MAP } from '@/constants';
import { useRoleOptionsStore } from '@/stores/roleOptionsStore';
import React, { useEffect } from 'react';

interface UserFilterBarProps {
  keyword: string;
  roleFilter?: string;
  statusFilter?: string;
  deptFilter?: string;
  onKeywordChange: (value: string) => void;
  onRoleChange: (value: string | undefined) => void;
  onStatusChange: (value: string | undefined) => void;
  onDeptChange: (value: string | undefined) => void;
}

const statusOptions = Object.entries(MEMBER_STATUS_MAP).map(([value, { label }]) => ({
  value,
  label,
}));

const UserFilterBar: React.FC<UserFilterBarProps> = ({
  keyword,
  roleFilter,
  statusFilter,
  deptFilter,
  onKeywordChange,
  onRoleChange,
  onStatusChange,
  onDeptChange,
}) => {
  const fetchRoleOptions = useRoleOptionsStore((s) => s.fetchRoleOptions);
  const getRoleSelectOptions = useRoleOptionsStore((s) => s.getRoleSelectOptions);

  useEffect(() => {
    fetchRoleOptions().catch(() => {});
  }, [fetchRoleOptions]);

  const roleOptions = getRoleSelectOptions();

  const filterList = [
    <FilterInput
      key="keyword"
      filterKey="keyword"
      label="关键词"
      value={keyword}
      onChange={(v) => onKeywordChange(v ?? '')}
      placeholder="搜索姓名/工号/邮箱"
    />,
    <FilterSelect
      key="role"
      filterKey="role"
      label="角色"
      value={roleFilter}
      onChange={(v) => onRoleChange(v as string | undefined)}
      options={roleOptions}
    />,
    <FilterSelect
      key="status"
      filterKey="status"
      label="状态"
      value={statusFilter}
      onChange={(v) => onStatusChange(v as string | undefined)}
      options={statusOptions}
    />,
    <FilterTreeSelect
      key="dept"
      filterKey="dept"
      label="部门"
      value={deptFilter}
      onChange={(v) => onDeptChange(v as string | undefined)}
      autoLoadDept
      showSearch
    />,
  ];

  return <CommonFilter label="筛选" list={filterList} />;
};

export default UserFilterBar;
