import type { PermissionDefinitionsResponse, RoleConfig } from '@/types';
import { UserRole } from '@/types';
import { Button, Space, Switch, Tabs } from 'antd';
import React, { useMemo } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface PermissionConfigProps {
  selectedPerms: string[];
  onSelectedPermsChange: (perms: string[]) => void;
  currentRole: RoleConfig | null;
  definitions: PermissionDefinitionsResponse | null;
}

const PermissionConfig: React.FC<PermissionConfigProps> = ({
  selectedPerms,
  onSelectedPermsChange,
  currentRole,
  definitions,
}) => {
  const isSystemAdmin = currentRole?.key === UserRole.SYSTEM_ADMIN;
  const allPermKeys = definitions?.permissions.map((p) => p.key) ?? [];

  const tabItems = useMemo(() => {
    if (!definitions) return [];

    const { permissions, categories } = definitions;
    return Object.entries(categories).map(([catKey, catLabel]) => {
      const perms = permissions.filter((p) => p.category === catKey);
      return {
        key: catKey,
        label: catLabel,
        children: (
          <div className={classNames('permission-config-title', styles['permission-config-title'])}>
            {perms.map((perm) => (
              <div
                key={perm.key}
                className={classNames('permission-config-desc', styles['permission-config-desc'])}
              >
                <div>
                  <div className={classNames('permission-config-actions', styles['permission-config-actions'])}>{perm.name}</div>
                  <div className={classNames('permission-config-toolbar', styles['permission-config-toolbar'])}>{perm.description}</div>
                </div>
                <Switch
                  size="small"
                  checked={selectedPerms.includes(perm.key)}
                  onChange={(checked) => {
                    onSelectedPermsChange(
                      checked
                        ? [...selectedPerms, perm.key]
                        : selectedPerms.filter((k) => k !== perm.key),
                    );
                  }}
                  disabled={isSystemAdmin}
                />
              </div>
            ))}
          </div>
        ),
      };
    });
  }, [definitions, selectedPerms, onSelectedPermsChange, isSystemAdmin]);

  return (
    <div className={classNames('permission-config-list', styles['permission-config-list'])}>
      <div className={classNames('permission-config-empty', styles['permission-config-empty'])}>
        <span className={classNames('permission-config-loading', styles['permission-config-loading'])}>权限配置</span>
        <Space>
          <Button
            size="small"
            onClick={() => onSelectedPermsChange(allPermKeys)}
            disabled={!definitions}
          >
            全选
          </Button>
          <Button size="small" onClick={() => onSelectedPermsChange([])}>
            清空
          </Button>
        </Space>
      </div>
      {isSystemAdmin && (
        <div className={classNames('permission-config-content', styles['permission-config-content'])}>
          系统管理员拥有所有权限，不可修改
        </div>
      )}
      <Tabs tabPosition="left" items={tabItems} />
    </div>
  );
};

export default PermissionConfig;
