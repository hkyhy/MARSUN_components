import type { PermissionDefinitionsResponse, RoleConfig } from '@/types';
import { Tabs, Typography } from 'antd';
import React, { useMemo } from 'react';
import { getRoleDisplayName } from '../../utils/roleValidation';
import styles from './style.module.scss';
import classNames from 'classnames';

const { Text } = Typography;

interface PermissionListProps {
  roles: RoleConfig[];
  definitions: PermissionDefinitionsResponse | null;
}

const PermissionList: React.FC<PermissionListProps> = ({ roles, definitions }) => {
  const tabItems = useMemo(() => {
    if (!definitions) return [];

    const { permissions, categories } = definitions;
    return Object.entries(categories).map(([catKey, catLabel]) => {
      const perms = permissions.filter((p) => p.category === catKey);
      return {
        key: catKey,
        label: catLabel,
        children: (
          <div className={classNames('permission-list-aside', styles['permission-list-aside'])}>
            {perms.map((perm) => (
              <div key={perm.key} className={classNames('permission-list-main', styles['permission-list-main'])}>
                <div className={classNames('permission-list-section', styles['permission-list-section'])}>{perm.name}</div>
                <div className={classNames('permission-list-group', styles['permission-list-group'])}>{perm.description}</div>
                <div className={classNames('permission-list-cell', styles['permission-list-cell'])}>
                  <Text type="secondary" className={classNames('permission-list-overlay', styles['permission-list-overlay'])}>
                    授权角色：
                    {roles
                      .filter((r) => r.permissions.includes(perm.key))
                      .map((r) => getRoleDisplayName(r))
                      .join('、') || '无'}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        ),
      };
    });
  }, [roles, definitions]);

  return <Tabs tabPosition="left" items={tabItems} />;
};

export default PermissionList;
