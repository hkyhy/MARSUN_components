import { fileApi } from '@/api';
import { folderSelectLabel, folderTreeNodeTitle } from '@/components/Files/utils/folderDisplay';
import { Tag, TreeSelect } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

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

interface TreeNodeItem {
  title: React.ReactNode;
  label: string;
  value: string;
  key: string;
  disabled?: boolean;
  children: TreeNodeItem[];
}

interface FolderTreeSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  /** 当前文件夹 ID：该节点及其后代不显示，其父节点显示「当前」标签且不可选择 */
  currentId?: string;
  placeholder?: string;
  /** 是否只显示已审核通过的文件夹，默认 false */
  onlyApproved?: boolean;
  /** 按部门子树过滤（与后端 collectDepartmentIds 一致） */
  scopeDepartmentId?: string;
  /** 隐藏根目录选项（业务文件夹移动/创建时必须选上级） */
  hideRoot?: boolean;
  /** 仅显示公共文件夹（isPublic 或无部门归属），用于公共文件夹上传场景 */
  publicOnly?: boolean;
}

/** 获取指定节点的所有后代 ID（BFS） */
function getDescendantIds(data: FolderNode[], id: string): Set<string> {
  const ids = new Set<string>();
  const queue = [id];
  while (queue.length > 0) {
    const current = queue.shift()!;
    data.forEach((f) => {
      if (f.parentId === current && !ids.has(f.id)) {
        ids.add(f.id);
        queue.push(f.id);
      }
    });
  }
  return ids;
}

/** 过滤掉祖先链断裂的文件夹 */
function filterOrphans(data: FolderNode[]): FolderNode[] {
  const validIds = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const f of data) {
      if (validIds.has(f.id)) continue;
      if (!f.parentId || validIds.has(f.parentId)) {
        validIds.add(f.id);
        changed = true;
      }
    }
  }
  return data.filter((f) => validIds.has(f.id));
}

/** 文件夹树选择组件 */
const FolderTreeSelect: React.FC<FolderTreeSelectProps> = ({
  value,
  onChange,
  currentId,
  placeholder = '选择目标文件夹',
  onlyApproved = false,
  scopeDepartmentId,
  hideRoot = false,
  publicOnly = false,
}) => {
  const [allFolderData, setAllFolderData] = useState<FolderNode[]>([]);

  useEffect(() => {
    const params = scopeDepartmentId ? { departmentId: scopeDepartmentId } : undefined;
    fileApi
      .folders(params)
      .then((res) => {
        const data = (res as unknown as { data: FolderNode[] }).data;
        setAllFolderData(filterOrphans(data));
      })
      .catch(() => {});
  }, [scopeDepartmentId]);

  const folderData = useMemo(() => {
    let filtered = allFolderData;

    if (publicOnly) {
      filtered = filtered.filter((f) => f.isPublic || f.departmentId == null);
    }

    if (onlyApproved) {
      const idsToKeep = new Set<string>();
      if (currentId) {
        idsToKeep.add(currentId);
        let ancestorId: string | null | undefined = currentId;
        while (ancestorId) {
          const folder = allFolderData.find((f) => f.id === ancestorId);
          if (folder?.parentId) {
            idsToKeep.add(folder.parentId);
            ancestorId = folder.parentId;
          } else {
            break;
          }
        }
      }
      filtered = filtered.filter((f) => f.reviewStatus === 'APPROVED' || idsToKeep.has(f.id));
    }

    return filtered;
  }, [allFolderData, onlyApproved, currentId, publicOnly]);

  const treeData = useMemo(() => {
    const skipIds = currentId ? getDescendantIds(folderData, currentId) : new Set<string>();
    if (currentId) skipIds.add(currentId);

    const currentFolder = currentId ? folderData.find((f) => f.id === currentId) : null;
    const parentOfCurrent = currentFolder?.parentId ?? null;

    const rootChildren: TreeNodeItem[] = [];
    const map = new Map<string, TreeNodeItem>();

    folderData.forEach((f) => {
      if (skipIds.has(f.id)) return;

      const isParent = parentOfCurrent && f.id === parentOfCurrent;
      map.set(f.id, {
        title: folderTreeNodeTitle(
          f,
          isParent ? (
            <Tag color="blue" className={classNames('folder-tree-select-track', styles['folder-tree-select-track'])}>
              当前
            </Tag>
          ) : undefined,
        ),
        label: folderSelectLabel(f),
        value: f.id,
        key: f.id,
        disabled: !!isParent,
        children: [],
      });
    });

    folderData.forEach((f) => {
      if (skipIds.has(f.id)) return;
      const node = map.get(f.id)!;
      if (f.parentId && map.has(f.parentId)) {
        map.get(f.parentId)!.children.push(node);
      } else {
        rootChildren.push(node);
      }
    });

    if (hideRoot) {
      return rootChildren;
    }

    const rootDisabled = currentId && !parentOfCurrent;

    return [
      {
        title: rootDisabled ? (
          <span>
            根目录{' '}
            <Tag color="blue" className={classNames('folder-tree-select-track', styles['folder-tree-select-track'])}>
              当前
            </Tag>
          </span>
        ) : (
          '根目录'
        ),
        label: '根目录',
        value: '',
        key: 'root',
        disabled: !!rootDisabled,
        children: rootChildren,
      },
    ];
  }, [folderData, currentId, hideRoot]);

  return (
    <TreeSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={!hideRoot}
      treeData={treeData}
      treeNodeLabelProp="label"
      treeDefaultExpandAll
    />
  );
};

export default FolderTreeSelect;
