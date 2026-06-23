import { DeleteButton } from '@/components/System/Department/Action';
import type { Department } from '@/types';
import { Pencil, Plus } from '@/icons';
import { Button, Space, Spin, Tree } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface TreeDataItem {
  key: string;
  title: React.ReactNode;
  children?: TreeDataItem[];
}

interface DeptTreeProps {
  deptTree: Department[];
  loading: boolean;
  isSystemAdmin: boolean;
  onEdit: (dept: { id: string; name: string; parentId: string | null }) => void;
  onDelete: () => void;
  /** 点击节点添加子部门 */
  onAdd?: (parentId: string) => void;
}

/** 收集所有节点 key */
function collectAllKeys(depts: Department[]): string[] {
  const keys: string[] = [];
  for (const dept of depts) {
    keys.push(dept.id);
    if (dept.children) keys.push(...collectAllKeys(dept.children));
  }
  return keys;
}

/** 部门树展示（含树节点内编辑/删除按钮） */
const DeptTree: React.FC<DeptTreeProps> = ({
  deptTree,
  loading,
  isSystemAdmin,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const allKeys = useMemo(() => collectAllKeys(deptTree), [deptTree]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 每次树数据刷新时，默认展开全部节点
  useEffect(() => {
    setExpandedKeys(allKeys);
  }, [allKeys]);

  const buildTreeNodes = (depts: Department[]): TreeDataItem[] => {
    return depts.map((dept) => ({
      key: dept.id,
      title: (
        <div className={classNames('dept-tree-list', styles['dept-tree-list'])}>
          <span className={classNames('dept-tree-empty', styles['dept-tree-empty'])}>{dept.name}</span>
          {isSystemAdmin && (
            <Space size={0} className={classNames('dept-tree-loading', styles['dept-tree-loading'])}>
              <Button
                type="text"
                size="small"
                icon={<Plus />}
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd?.(dept.id);
                }}
              />
              <Button
                type="text"
                size="small"
                icon={<Pencil />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit({ id: dept.id, name: dept.name, parentId: dept.parentId ?? null });
                }}
              />
              <DeleteButton dept={{ id: dept.id, name: dept.name }} onSuccess={onDelete} />
            </Space>
          )}
        </div>
      ),
      children: dept.children ? buildTreeNodes(dept.children) : undefined,
    }));
  };

  const treeData = buildTreeNodes(deptTree);

  return (
    <Spin spinning={loading}>
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        showLine
      />
    </Spin>
  );
};

export default DeptTree;
