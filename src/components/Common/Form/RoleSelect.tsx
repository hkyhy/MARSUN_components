import { useRoleOptionsStore } from '@/stores/roleOptionsStore';
import { Select } from 'antd';
import React, { useEffect, useMemo } from 'react';

type RoleSelectProps = Omit<React.ComponentProps<typeof Select>, 'options' | 'loading'>;

/** 自动加载角色列表的 Select 组件（使用 /permissions/role-options，所有已登录用户可用） */
const RoleSelect: React.FC<RoleSelectProps> = ({ placeholder = '请选择角色', ...rest }) => {
  const fetchRoleOptions = useRoleOptionsStore((s) => s.fetchRoleOptions);
  const roleList = useRoleOptionsStore((s) => s.roleList);
  const loading = useRoleOptionsStore((s) => s.loading);

  useEffect(() => {
    fetchRoleOptions().catch(() => {});
  }, [fetchRoleOptions]);

  const options = useMemo(
    () => (roleList ?? []).map((role) => ({ value: role.key, label: role.name })),
    [roleList],
  );

  return <Select placeholder={placeholder} options={options} loading={loading} {...rest} />;
};

export default RoleSelect;
