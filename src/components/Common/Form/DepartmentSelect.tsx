import { deptApi } from '@/api';
import type { Department } from '@/types';
import { buildDepartmentPathMapFromTree } from '@/utils/department/departmentPath';
import { Tag, TreeSelect } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

interface TreeNodeItem {
  value: string;
  title: React.ReactNode;
  /** 纯文本标题，用于搜索过滤 */
  titleStr: string;
  key: string;
  children?: TreeNodeItem[];
}

function buildDeptTreeData(
  tree: Department[],
  pathMap: Map<string, string>,
  excludeId?: string,
  currentId?: string,
): TreeNodeItem[] {
  return tree
    .filter((d) => d.id !== excludeId)
    .map((d) => ({
      value: d.id,
      titleStr: pathMap.get(d.id) ?? d.name,
      title:
        currentId && d.id === currentId ? (
          <span>
            {d.name}{' '}
            <Tag color="blue" style={{ marginLeft: 4, lineHeight: '18px' }}>
              当前
            </Tag>
          </span>
        ) : (
          d.name
        ),
      key: d.id,
      children: d.children?.length
        ? buildDeptTreeData(d.children, pathMap, excludeId, currentId)
        : undefined,
    }));
}

export interface DepartmentSelectProps extends Omit<
  React.ComponentProps<typeof TreeSelect>,
  'treeData'
> {
  /** 编辑时排除当前部门 ID */
  excludeId?: string;
  /** 当前所属部门 ID，在下拉中该节点旁显示"当前"标签 */
  currentId?: string;
}

/** 自动加载部门树的 TreeSelect 组件 */
const DepartmentSelect: React.FC<DepartmentSelectProps> = ({ excludeId, currentId, ...rest }) => {
  const [rawTree, setRawTree] = useState<Department[]>([]);

  useEffect(() => {
    deptApi
      .tree()
      .then((res) => {
        const tree = (res as unknown as { data: Department[] }).data;
        setRawTree(tree);
      })
      .catch(() => {});
  }, []);

  const pathMap = useMemo(
    () => (rawTree.length ? buildDepartmentPathMapFromTree(rawTree) : new Map()),
    [rawTree],
  );

  const treeData = useMemo(
    () => buildDeptTreeData(rawTree, pathMap, excludeId, currentId),
    [rawTree, pathMap, excludeId, currentId],
  );

  return (
    <TreeSelect
      placeholder="请选择部门"
      allowClear
      showSearch
      treeNodeFilterProp="titleStr"
      treeNodeLabelProp="titleStr"
      treeData={treeData}
      treeDefaultExpandAll
      {...rest}
    />
  );
};

export default DepartmentSelect;
