import { deptApi } from '@/api';
import { Check, X, ChevronDown, ChevronRight } from '@/icons';
import type { Department } from '@/types';
import {
  buildDepartmentPathMapFromTree,
  getDepartmentPath,
} from '@/utils/department/departmentPath';
import { Checkbox, Input, Space } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FilterPopover from '../FilterPopover';
import type { BaseFilterProps } from '../types';
import { resolveHidden } from '../types';
import { useFilterRegister } from '../useFilterState';
import styles from './style.module.scss';
import classNames from 'classnames';

const { Search } = Input;

export interface FilterTreeSelectProps extends BaseFilterProps {
  /** 传入树形数据（优先于 treeApi 自动加载） */
  treeData?: Department[];
  /** 自动加载部门树（默认 true） */
  autoLoadDept?: boolean;
  /** 当前值（单选时 string，多选时 string[]） */
  value?: string | string[] | undefined;
  /** 值变化回调 */
  onChange?: (value: string | string[] | undefined) => void;
  /** 是否显示搜索框（默认 false） */
  showSearch?: boolean;
  /** 是否多选（默认 false） */
  multiple?: boolean;
}

interface FlatNode {
  id: string;
  name: string;
  depth: number;
  parentId: string | null;
}

/** 将树形数据展平为一维列表（保留深度信息用于缩进） */
function flattenTree(nodes: Department[], depth = 0, parentId: string | null = null): FlatNode[] {
  const result: FlatNode[] = [];
  for (const node of nodes) {
    result.push({ id: node.id, name: node.name, depth, parentId });
    if (node.children?.length) {
      result.push(...flattenTree(node.children, depth + 1, node.id));
    }
  }
  return result;
}

/** 根据搜索关键词过滤节点（匹配节点及其所有祖先） */
function filterByKeyword(nodes: Department[], keyword: string): Department[] {
  if (!keyword) return nodes;

  const lower = keyword.toLowerCase();

  function matchTree(items: Department[]): Department[] {
    const result: Department[] = [];
    for (const item of items) {
      const children = item.children?.length ? matchTree(item.children) : [];
      const selfMatch = item.name.toLowerCase().includes(lower);
      if (selfMatch || children.length > 0) {
        result.push({ ...item, children: children.length > 0 ? children : undefined });
      }
    }
    return result;
  }

  return matchTree(nodes);
}

/** 收集所有含子节点的部门 ID，用于默认展开 */
function collectExpandableIds(nodes: Department[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.children?.length) {
      ids.push(node.id);
      ids.push(...collectExpandableIds(node.children));
    }
  }
  return ids;
}

const FilterTreeSelect: React.FC<FilterTreeSelectProps> = ({
  filterKey,
  label,
  treeData: externalTreeData,
  autoLoadDept = true,
  value,
  onChange,
  showSearch = false,
  multiple = false,
  active,
  hidden,
}) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState<string | string[] | undefined>(
    value ?? (multiple ? [] : undefined),
  );
  const [loadedTree, setLoadedTree] = useState<Department[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState('');

  // ── 自动注册到 CommonFilter ──
  const registerFn = useFilterRegister();

  // 同步外部 value
  useEffect(() => {
    setLocalValue(value ?? (multiple ? [] : undefined));
    // 外部清空时同时清空搜索文本
    if (value === undefined || value === null) {
      setSearchText('');
    }
  }, [value, multiple]);

  // 自动加载部门树
  useEffect(() => {
    if (autoLoadDept && !externalTreeData) {
      deptApi
        .tree()
        .then((res) => {
          const tree = (res as unknown as { data: Department[] }).data;
          setLoadedTree(tree);
          setExpandedKeys(new Set(collectExpandableIds(tree)));
        })
        .catch(() => {});
    }
  }, [autoLoadDept, externalTreeData]);

  const sourceTree = externalTreeData || loadedTree;

  const pathMap = useMemo(
    () => (sourceTree.length ? buildDepartmentPathMapFromTree(sourceTree) : new Map()),
    [sourceTree],
  );

  // ── 计算已确认的 valueLabel（基于外部 value，点击确定后才更新）──
  const confirmedValueLabel = useMemo(() => {
    if (!sourceTree.length || value == null) return '';
    if (multiple) {
      const arr = value as string[];
      return arr.length > 0 ? arr.map((v) => getDepartmentPath(pathMap, v, v)).join('、') : '';
    }
    return getDepartmentPath(pathMap, value as string, '');
  }, [sourceTree, value, multiple, pathMap]);

  useEffect(() => {
    if (!registerFn) return;
    if (resolveHidden(hidden)) {
      registerFn.unregister(filterKey);
      return;
    }
    if (confirmedValueLabel) {
      registerFn.register(filterKey, {
        label,
        valueLabel: confirmedValueLabel,
        onRemove: () => onChange?.(multiple ? [] : undefined),
      });
    } else {
      registerFn.unregister(filterKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedValueLabel, filterKey, label, hidden]);

  // 搜索过滤
  const filteredTree = useMemo(
    () => (showSearch && searchText ? filterByKeyword(sourceTree, searchText) : sourceTree),
    [showSearch, searchText, sourceTree],
  );

  // 搜索过滤后同步展开匹配到的分支；清空搜索时恢复全树展开
  useEffect(() => {
    if (!showSearch) return;
    if (searchText) {
      setExpandedKeys(new Set(collectExpandableIds(filteredTree)));
    } else if (sourceTree.length) {
      setExpandedKeys(new Set(collectExpandableIds(sourceTree)));
    }
  }, [showSearch, searchText, filteredTree, sourceTree]);

  // 展平用于渲染
  const flatNodes = useMemo(() => flattenTree(filteredTree), [filteredTree]);

  // 构建查找 map（判断节点是否有子节点，与当前展示树一致）
  const hasChildrenMap = useMemo(() => {
    const map = new Map<string, boolean>();
    function walk(nodes: Department[]) {
      for (const n of nodes) {
        map.set(n.id, !!n.children?.length);
        if (n.children) walk(n.children);
      }
    }
    walk(filteredTree);
    return map;
  }, [filteredTree]);

  // 构建子节点映射（父节点 ID → 子节点 ID 列表）
  const childrenMap = useMemo(() => {
    const map = new Map<string, string[]>();
    function walk(nodes: Department[]) {
      for (const n of nodes) {
        if (n.children?.length) {
          const childIds: string[] = [];
          function collectAll(node: Department) {
            childIds.push(node.id);
            node.children?.forEach(collectAll);
          }
          n.children.forEach(collectAll);
          map.set(n.id, childIds);
          walk(n.children);
        }
      }
    }
    walk(filteredTree);
    return map;
  }, [filteredTree]);

  // 构建父节点映射（子节点 ID → 父节点 ID）
  const parentMap = useMemo(() => {
    const map = new Map<string, string>();
    function walk(nodes: Department[]) {
      for (const n of nodes) {
        if (n.children?.length) {
          for (const child of n.children) {
            map.set(child.id, n.id);
          }
          walk(n.children);
        }
      }
    }
    walk(filteredTree);
    return map;
  }, [filteredTree]);

  // ── 单选 ──
  const handleSingleSelect = useCallback(
    (nodeId: string) => {
      const next = localValue === nodeId ? undefined : nodeId;
      setLocalValue(next);
      onChange?.(next);
      setOpen(false); // 单选自动收起
    },
    [localValue, onChange],
  );

  // ── 多选（带父子级联）──
  const handleToggleMulti = useCallback(
    (nodeId: string) => {
      const arr = ((localValue as string[]) || []).slice();
      const childIds = childrenMap.get(nodeId);
      const parentId = parentMap.get(nodeId);

      if (childIds) {
        // 点击的是父节点：切换该父节点及其所有子节点
        const isCurrentlyChecked = arr.includes(nodeId);
        if (isCurrentlyChecked) {
          // 取消选中：移除父节点和所有子节点
          const removeSet = new Set([nodeId, ...childIds]);
          setLocalValue(arr.filter((v) => !removeSet.has(v)));
        } else {
          // 选中：添加父节点和所有子节点
          const addSet = new Set([nodeId, ...childIds]);
          setLocalValue([...new Set([...arr, ...addSet])]);
        }
      } else {
        // 点击的是子节点：切换该子节点，并更新父节点状态
        if (arr.includes(nodeId)) {
          // 取消选中子节点
          const next = arr.filter((v) => v !== nodeId);
          // 同时取消父节点（因为不再全选）
          if (parentId && next.includes(parentId)) {
            setLocalValue(next.filter((v) => v !== parentId));
          } else {
            setLocalValue(next);
          }
        } else {
          // 选中子节点
          const next = [...arr, nodeId];
          // 检查是否该父节点的所有子节点都已选中
          if (parentId) {
            const siblingIds = childrenMap.get(parentId) || [];
            const allSiblingsSelected = siblingIds.every((id) => next.includes(id));
            if (allSiblingsSelected) {
              setLocalValue([...new Set([...next, parentId])]);
            } else {
              setLocalValue(next);
            }
          } else {
            setLocalValue(next);
          }
        }
      }
    },
    [localValue, childrenMap, parentMap],
  );

  const handleConfirm = () => {
    onChange?.(localValue);
    setOpen(false);
  };

  const handleReset = () => {
    const next = multiple ? [] : undefined;
    setLocalValue(next);
    setSearchText('');
    onChange?.(next);
    setOpen(false);
  };

  const toggleExpand = useCallback((nodeId: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // 判断节点是否可见
  const isVisible = useCallback(
    (node: FlatNode): boolean => {
      if (node.parentId === null) return true;
      if (showSearch && searchText) return true;
      return expandedKeys.has(node.parentId);
    },
    [expandedKeys, showSearch, searchText],
  );

  // 判断多选是否选中
  const isMultiSelected = useCallback(
    (nodeId: string) => ((localValue as string[]) || []).includes(nodeId),
    [localValue],
  );

  // 判断多选是否半选（indeterminate）—— 父节点部分子节点选中时
  const isMultiIndeterminate = useCallback(
    (nodeId: string): boolean => {
      if (!multiple) return false;
      const arr = (localValue as string[]) || [];
      const childIds = childrenMap.get(nodeId);
      if (!childIds) return false; // 叶子节点没有半选状态
      const selectedChildCount = childIds.filter((id) => arr.includes(id)).length;
      return selectedChildCount > 0 && selectedChildCount < childIds.length;
    },
    [multiple, localValue, childrenMap],
  );

  // hidden 处理 - 必须在所有 hooks 之后
  if (resolveHidden(hidden)) return null;

  return (
    <FilterPopover
      label={label}
      active={active || (multiple ? (localValue as string[])?.length > 0 : !!value)}
      open={open}
      onOpenChange={setOpen}
      onConfirm={multiple ? handleConfirm : undefined}
      onReset={handleReset}
    >
      {/* 搜索框 */}
      {showSearch && (
        <Search
          placeholder={`搜索${label}`}
          allowClear
          size="middle"
          className={classNames('filter-tree-select-search', styles['filter-tree-select-search'])}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      )}

      {/* 树形结构 */}
      <div className={classNames('filter-tree-select-options', styles['filter-tree-select-options'])}>
        {flatNodes.map((node) => {
          if (!isVisible(node)) return null;

          const isLeaf = !hasChildrenMap.get(node.id);
          const isExpanded = expandedKeys.has(node.id);
          const isSingleSelected = !multiple && localValue === node.id;
          const isMultiChecked = multiple && isMultiSelected(node.id);
          const isMultiHalfChecked = multiple && isMultiIndeterminate(node.id);

          return (
            <div
              key={node.id}
              className={classNames('filter-tree-select-option', styles['filter-tree-select-option'],
                isSingleSelected &&
                  classNames('filter-tree-select-option-selected', styles['filter-tree-select-option-selected']),
              )}
              style={{ paddingLeft: 8 + node.depth * 20 }}
              onClick={() => (multiple ? handleToggleMulti(node.id) : handleSingleSelect(node.id))}
            >
              {/* 展开/折叠图标 */}
              {!isLeaf ? (
                <span
                  className={classNames('filter-tree-select-expand-icon', styles['filter-tree-select-expand-icon'])}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(node.id);
                  }}
                >
                  {isExpanded || (showSearch && !!searchText) ? (
                    <ChevronDown style={{ fontSize: 10 }} />
                  ) : (
                    <ChevronRight style={{ fontSize: 10 }} />
                  )}
                </span>
              ) : (
                <span className={classNames('filter-tree-select-expand-placeholder', styles['filter-tree-select-expand-placeholder'])} />
              )}

              {/* 多选 Checkbox */}
              {multiple && <Checkbox checked={isMultiChecked} indeterminate={isMultiHalfChecked} />}

              {/* 节点名称 */}
              <span className={classNames('filter-tree-select-node-label', styles['filter-tree-select-node-label'])}>{node.name}</span>

              {/* 单选选中标记 */}
              {!multiple && isSingleSelected && (
                <Check className={classNames('filter-tree-select-option-check', styles['filter-tree-select-option-check'])} />
              )}
            </div>
          );
        })}
        {flatNodes.length === 0 && (
          <div className={classNames('filter-tree-select-empty', styles['filter-tree-select-empty'])}>暂无数据</div>
        )}
      </div>

      {/* 多选已选标签 */}
      {multiple && (localValue as string[])?.length > 0 && (
        <div className={classNames('filter-tree-select-selected-bar', styles['filter-tree-select-selected-bar'])}>
          <div className={classNames('filter-tree-select-selected-label', styles['filter-tree-select-selected-label'])}>已选：</div>
          <Space size={[4, 4]} wrap>
            {(localValue as string[])
              .filter((v) => {
                // 父节点全选时只显示父节点标签，隐藏子节点标签
                const parentId = parentMap.get(v);
                if (parentId) {
                  const isParentChecked = ((localValue as string[]) || []).includes(parentId);
                  return !isParentChecked;
                }
                return true;
              })
              .map((v) => {
                const node = flatNodes.find((n) => n.id === v);
                return (
                  <span
                    key={v}
                    className={classNames('filter-tree-select-selected-tag', styles['filter-tree-select-selected-tag'])}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMulti(v);
                    }}
                  >
                    {node?.name ?? v}
                    <X className={classNames('filter-tree-select-selected-remove', styles['filter-tree-select-selected-remove'])} />
                  </span>
                );
              })}
          </Space>
        </div>
      )}
    </FilterPopover>
  );
};

export default FilterTreeSelect;
