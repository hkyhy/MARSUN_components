import { fileApi } from '@/api';
import { folderTreeNodeTitle } from '@/components/Files/utils/folderDisplay';
import { Folder } from '@/icons';
import type { TreeProps } from 'antd';
import { Input, Tree } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';
import type { BreadcrumbItem } from '../FilterBar';

const { Search } = Input;

interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;
  departmentId?: string | null;
  departmentName?: string;
  reviewStatus?: string;
  isDepartmentFolder?: boolean;
  isPublic?: boolean;
}

interface FolderTreeProps {
  currentParentId: string | null;
  onSelect: (folderId: string | null, pathItems: BreadcrumbItem[]) => void;
  departmentId?: string;
  refreshKey?: number;
  autoSelectDeptFolder?: boolean;
}

interface TreeNodeData {
  title: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children: TreeNodeData[];
}

/** 过滤掉祖先链断裂的文件夹（父文件夹已被删除，子文件夹也不可见） */
function filterOrphans(data: FolderNode[]): FolderNode[] {
  const allIds = new Set(data.map((f) => f.id));
  const validIds = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const f of data) {
      if (validIds.has(f.id)) continue;
      // 满足任一条件即为有效：
      // 1. 无父节点（根文件夹）
      // 2. 父节点不在本批数据中（因部门过滤被裁剪，视为根层级）
      // 3. 父节点已被确认有效
      if (!f.parentId || !allIds.has(f.parentId) || validIds.has(f.parentId)) {
        validIds.add(f.id);
        changed = true;
      }
    }
  }
  return data.filter((f) => validIds.has(f.id));
}

/** 从根目录到指定文件夹的面包屑路径 */
function buildBreadcrumbPath(folderId: string | null, allData: FolderNode[]): BreadcrumbItem[] {
  if (!folderId) return [{ id: null, name: '根目录' }];
  const path: BreadcrumbItem[] = [];
  let current = allData.find((f) => f.id === folderId);
  while (current) {
    path.unshift({ id: current.id, name: current.name });
    current = current.parentId ? allData.find((f) => f.id === current!.parentId) : undefined;
  }
  return [{ id: null, name: '根目录' }, ...path];
}

/** 获取指定文件夹的所有祖先 key（用于自动展开路径） */
function getAncestorKeys(folderId: string, data: FolderNode[]): string[] {
  const keys: string[] = [];
  let current = data.find((f) => f.id === folderId);
  while (current?.parentId) {
    keys.unshift(current.parentId);
    current = data.find((f) => f.id === current!.parentId);
  }
  return keys;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  currentParentId,
  onSelect,
  departmentId,
  refreshKey,
  autoSelectDeptFolder = true,
}) => {
  const [allFolderData, setAllFolderData] = useState<FolderNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['root']);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const autoSelectedDeptId = useRef<string | undefined>();

  // 获取文件夹数据（部门筛选走后端子树过滤）
  useEffect(() => {
    const params = departmentId ? { departmentId } : undefined;
    fileApi
      .folders(params)
      .then((res) => {
        const data = (res as unknown as { data: FolderNode[] }).data;
        setAllFolderData(filterOrphans(data));
      })
      .catch(() => {});
  }, [refreshKey, departmentId]);

  const filteredData = allFolderData;

  // 构建树数据（支持搜索高亮）
  const treeData = useMemo(() => {
    const matchedKeys = new Set<string>();

    if (searchValue) {
      const lower = searchValue.toLowerCase();
      filteredData.forEach((f) => {
        if (f.name.toLowerCase().includes(lower)) {
          matchedKeys.add(f.id);
          getAncestorKeys(f.id, filteredData).forEach((k) => matchedKeys.add(k));
        }
      });
    }

    const rootChildren: TreeNodeData[] = [];
    const map = new Map<string, TreeNodeData>();

    filteredData.forEach((f) => {
      if (searchValue && !matchedKeys.has(f.id)) return;

      const title = searchValue
        ? f.name
            .split(new RegExp(`(${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
            .map((part, i) =>
              part.toLowerCase() === searchValue.toLowerCase() ? (
                <span key={i} className={classNames('folder-tree-search-highlight', styles['folder-tree-search-highlight'])}>
                  {part}
                </span>
              ) : (
                part
              ),
            )
        : folderTreeNodeTitle(f);

      map.set(f.id, {
        title: searchValue ? <span>{title}</span> : title,
        key: f.id,
        icon: <Folder className={classNames('folder-tree-folder-icon', styles['folder-tree-folder-icon'])} />,
        children: [],
      });
    });

    filteredData.forEach((f) => {
      if (searchValue && !matchedKeys.has(f.id)) return;
      const node = map.get(f.id)!;
      if (f.parentId && map.has(f.parentId)) {
        map.get(f.parentId)!.children.push(node);
      } else {
        rootChildren.push(node);
      }
    });

    return [
      {
        title: '根目录',
        key: 'root',
        icon: <Folder className={classNames('folder-tree-folder-icon', styles['folder-tree-folder-icon'])} />,
        children: rootChildren,
      },
    ];
  }, [filteredData, searchValue]);

  // 自动选中部门根文件夹
  useEffect(() => {
    if (!autoSelectDeptFolder) return;
    if (!departmentId || currentParentId !== null) return;
    if (filteredData.length === 0) return;
    if (autoSelectedDeptId.current === departmentId) return;

    const rootFolders = filteredData.filter(
      (f) => !f.parentId || !filteredData.some((p) => p.id === f.parentId),
    );

    if (rootFolders.length > 0) {
      autoSelectedDeptId.current = departmentId;
      const firstRoot = rootFolders[0]!;
      const path = buildBreadcrumbPath(firstRoot.id, allFolderData);
      onSelect(firstRoot.id, path);
    }
  }, [filteredData, departmentId, currentParentId, onSelect, allFolderData]);

  // 自动展开：当前文件夹路径 + 搜索匹配路径
  useEffect(() => {
    const keys = new Set<string>(['root']);

    if (currentParentId) {
      keys.add(currentParentId);
      getAncestorKeys(currentParentId, filteredData).forEach((k) => keys.add(k));
    }

    if (searchValue) {
      const lower = searchValue.toLowerCase();
      filteredData.forEach((f) => {
        if (f.name.toLowerCase().includes(lower)) {
          keys.add(f.id);
          getAncestorKeys(f.id, filteredData).forEach((k) => keys.add(k));
        }
      });
    }

    setExpandedKeys(Array.from(keys));
    setAutoExpandParent(true);
  }, [currentParentId, filteredData, searchValue]);

  const handleSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys.length === 0) return;
    const key = selectedKeys[0] as string;
    const folderId = key === 'root' ? null : key;
    const path = buildBreadcrumbPath(folderId, allFolderData);
    onSelect(folderId, path);
  };

  return (
    <div className={classNames('folder-tree-folder-tree', styles['folder-tree-folder-tree'])}>
      <div className={classNames('folder-tree-search', styles['folder-tree-search'])}>
        <Search
          placeholder="搜索文件夹"
          allowClear
          size="small"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className={classNames('folder-tree-content', styles['folder-tree-content'])}>
        <Tree
          showIcon
          blockNode
          treeData={treeData}
          expandedKeys={expandedKeys}
          onExpand={(keys) => {
            setExpandedKeys(keys as string[]);
            setAutoExpandParent(false);
          }}
          autoExpandParent={autoExpandParent}
          selectedKeys={[currentParentId || 'root']}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
};

export default FolderTree;
