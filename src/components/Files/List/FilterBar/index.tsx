import { userApi } from '@/api';
import {
  CommonFilter,
  FilterDateRange,
  FilterInput,
  FilterSelect,
  FilterTreeSelect,
} from '@/components/Common';
import { FILE_TYPE_LABEL_MAP, FILE_EXISTENCE_FILTER_OPTIONS, type FileExistenceStatus } from '@/constants';
import { useDepartmentPath } from '@/hooks/useDepartmentPath';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { Department } from '@/types';
import { toDateRange } from '@/utils/date';
import type { PersonOptionDto } from '@/utils/user/personOption';
import { normalizePersonDtos, toDepartmentPathMaps, toPersonOptions } from '@/utils/user/personOption';
import { House } from '@/icons';
import { Breadcrumb } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';
import {
  canShowFileDeptFilter,
  canShowFileUploaderFilter,
  FILE_LIST_SORT_DEFAULT,
  FILE_SORT_ORDER_OPTIONS,
  type FileListSortState,
  type FileSortField,
  type FileSortOrder,
} from '../../constants';

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface FileFilterBarProps {
  keyword: string;
  deptFilter?: string;
  uploaderFilter?: string;
  fileTypeFilter?: string[];
  fileExistenceFilter?: FileExistenceStatus;
  dateRange?: [string, string] | null;
  sortState?: FileListSortState;
  breadcrumbItems: BreadcrumbItem[];
  /** 不传则按当前用户角色自动判断 */
  showUploaderFilter?: boolean;
  onKeywordChange: (keyword: string) => void;
  onDeptChange?: (deptId?: string) => void;
  onUploaderFilterChange: (uploaderId?: string) => void;
  onFileTypeChange?: (fileType?: string[]) => void;
  onFileExistenceChange?: (value?: FileExistenceStatus) => void;
  onDateRangeChange: (range: [string, string] | null) => void;
  onSortChange?: (state: FileListSortState) => void;
  onBreadcrumbClick: (index: number) => void;
}

/** 将 allowedFileTypes 转换为 Department 树形结构 */
function buildFileTypeTree(allowedFileTypes: Record<string, string[]>): Department[] {
  return Object.entries(allowedFileTypes).map(([typeName, exts], index) => ({
    id: typeName,
    name: FILE_TYPE_LABEL_MAP[typeName] || typeName,
    parentId: null,
    sort: index,
    memberCount: 0,
    children: exts.map((ext) => ({
      id: ext,
      name: ext,
      parentId: typeName,
      sort: 0,
      memberCount: 0,
    })),
  }));
}

const FileFilterBar: React.FC<FileFilterBarProps> = ({
  keyword,
  deptFilter,
  uploaderFilter,
  fileTypeFilter,
  fileExistenceFilter,
  dateRange,
  sortState = FILE_LIST_SORT_DEFAULT,
  breadcrumbItems,
  showUploaderFilter,
  onKeywordChange,
  onDeptChange,
  onUploaderFilterChange,
  onFileTypeChange,
  onFileExistenceChange,
  onDateRangeChange,
  onSortChange,
  onBreadcrumbClick,
}) => {
  const { user } = useAuthStore();
  const showDeptFilter = canShowFileDeptFilter(user?.role);
  const showUploader = showUploaderFilter ?? canShowFileUploaderFilter(user?.role);

  const [rawUploaderOptions, setRawUploaderOptions] = useState<PersonOptionDto[]>([]);
  const { pathMap } = useDepartmentPath();
  const { settings, loaded } = useSettingsStore();

  const uploaderOptions = useMemo(
    () => toPersonOptions(normalizePersonDtos(rawUploaderOptions), toDepartmentPathMaps(pathMap)),
    [rawUploaderOptions, pathMap],
  );

  const fileTypeTree = useMemo(
    () => (loaded ? buildFileTypeTree(settings.allowedFileTypes || {}) : []),
    [settings.allowedFileTypes, loaded],
  );

  useEffect(() => {
    const params: Record<string, unknown> = {};
    if (deptFilter) params.departmentId = deptFilter;
    userApi
      .uploaders(params)
      .then((res) => {
        const data = (res as unknown as { data: PersonOptionDto[] }).data;
        setRawUploaderOptions(data);
      })
      .catch(() => {});
  }, [deptFilter]);

  const handleDateRangeChange = useCallback(
    (range: [string, string] | null) => {
      onDateRangeChange(toDateRange(range));
    },
    [onDateRangeChange],
  );

  const handleSortFieldChange = useCallback(
    (field: FileSortField, order: FileSortOrder | undefined) => {
      if (!onSortChange) return;
      const clearField = (f: FileSortField): Partial<FileListSortState> => {
        if (f === 'updatedAt') return { updatedAtOrder: undefined };
        if (f === 'createdAt') return { createdAtOrder: undefined };
        return { totalScoreOrder: undefined };
      };
      if (order === undefined) {
        const next: FileListSortState = { ...sortState, ...clearField(field) };
        if (field === next.activeField) {
          next.activeField =
            next.updatedAtOrder != null
              ? 'updatedAt'
              : next.createdAtOrder != null
                ? 'createdAt'
                : next.totalScoreOrder != null
                  ? 'totalScore'
                  : 'updatedAt';
        }
        onSortChange(next);
        return;
      }
      onSortChange({
        ...sortState,
        activeField: field,
        ...(field === 'updatedAt'
          ? { updatedAtOrder: order }
          : field === 'createdAt'
            ? { createdAtOrder: order }
            : { totalScoreOrder: order }),
      });
    },
    [onSortChange, sortState],
  );

  const filterList = [
    <FilterInput
      key="keyword"
      filterKey="keyword"
      label="关键词"
      value={keyword || undefined}
      onChange={(v) => onKeywordChange(v ?? '')}
      placeholder="搜索文件..."
    />,
    <FilterTreeSelect
      key="dept"
      filterKey="dept"
      label="部门"
      value={deptFilter}
      onChange={(v) => onDeptChange?.(v as string | undefined)}
      showSearch
      hidden={!showDeptFilter || !onDeptChange}
    />,
    <FilterTreeSelect
      key="fileType"
      filterKey="fileType"
      label="文件类型"
      treeData={fileTypeTree}
      autoLoadDept={false}
      multiple
      value={fileTypeFilter}
      onChange={(v) => onFileTypeChange?.(v as string[] | undefined)}
      hidden={!onFileTypeChange}
    />,
    <FilterSelect
      key="uploader"
      filterKey="uploader"
      label="提交人"
      variant="person"
      options={uploaderOptions}
      value={uploaderFilter}
      onChange={(v) => onUploaderFilterChange(v as string | undefined)}
      searchable
      hidden={!showUploader}
    />,
    <FilterSelect
      key="fileExistence"
      filterKey="fileExistence"
      label="文件状态"
      options={FILE_EXISTENCE_FILTER_OPTIONS}
      value={fileExistenceFilter}
      onChange={(v) => onFileExistenceChange?.(v as FileExistenceStatus | undefined)}
      hidden={!onFileExistenceChange}
    />,
    <FilterDateRange
      key="dateRange"
      filterKey="dateRange"
      label="日期范围"
      value={dateRange}
      onChange={handleDateRangeChange}
      showQuickOptions={false}
    />,
    <FilterSelect
      key="sortUpdatedAt"
      filterKey="sortUpdatedAt"
      label="更新时间"
      options={FILE_SORT_ORDER_OPTIONS}
      value={sortState.updatedAtOrder}
      onChange={(v) => handleSortFieldChange('updatedAt', v as FileSortOrder | undefined)}
      hidden={!onSortChange}
    />,
    <FilterSelect
      key="sortCreatedAt"
      filterKey="sortCreatedAt"
      label="提交时间"
      options={FILE_SORT_ORDER_OPTIONS}
      value={sortState.createdAtOrder}
      onChange={(v) => handleSortFieldChange('createdAt', v as FileSortOrder | undefined)}
      hidden={!onSortChange}
    />,
    <FilterSelect
      key="sortTotalScore"
      filterKey="sortTotalScore"
      label="积分"
      options={FILE_SORT_ORDER_OPTIONS}
      value={sortState.totalScoreOrder}
      onChange={(v) => handleSortFieldChange('totalScore', v as FileSortOrder | undefined)}
      hidden={!onSortChange}
    />,
  ];

  return (
    <div className={classNames('filter-bar-filter-bar', styles['filter-bar-filter-bar'])}>
      {breadcrumbItems.length > 0 && (
        <Breadcrumb
          className={classNames('filter-bar-breadcrumb', styles['filter-bar-breadcrumb'])}
          items={breadcrumbItems.map((item, index) => ({
            title: (
              <span className={classNames('filter-bar-breadcrumb-item', styles['filter-bar-breadcrumb-item'])} onClick={() => onBreadcrumbClick(index)}>
                {index === 0 && <House className={classNames('filter-bar-breadcrumb-icon', styles['filter-bar-breadcrumb-icon'])} />}
                {item.name}
              </span>
            ),
          }))}
        />
      )}
      <CommonFilter label="筛选" list={filterList} />
    </div>
  );
};

export default FileFilterBar;
