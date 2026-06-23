import type { PersonOption } from '@/components/Common';
import { CommonFilter, FilterDateRange, FilterSelect, FilterTreeSelect } from '@/components/Common';
import { FILE_TYPE_LABEL_MAP, FILE_EXISTENCE_FILTER_OPTIONS, type FileExistenceStatus } from '@/constants';
import type { Department } from '@/types';
import { useSettingsStore } from '@/stores/settingsStore';
import { toDateRange } from '@/utils/date';
import React, { useCallback, useMemo } from 'react';
import {
  REVIEW_LIST_SORT_DEFAULT,
  REVIEW_SORT_ORDER_OPTIONS,
  type ReviewListSortState,
  type ReviewMode,
  type ReviewSortField,
  type ReviewSortOrder,
} from '../constants';

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

interface ReviewFilterBarProps {
  mode?: ReviewMode;
  reviewerOptions: PersonOption[];
  uploaderOptions?: PersonOption[];
  deptFilter?: string;
  uploaderFilter?: string;
  reviewerFilter?: string;
  fileTypeFilter?: string[];
  fileExistenceFilter?: FileExistenceStatus;
  dateRange?: [string, string] | null;
  sortState?: ReviewListSortState;
  onDeptChange: (value: string | undefined) => void;
  onUploaderChange: (value: string | undefined) => void;
  onReviewerChange: (value: string | undefined) => void;
  onFileTypeChange: (value: string[] | undefined) => void;
  onFileExistenceChange: (value?: FileExistenceStatus) => void;
  onDateRangeChange: (range: [string, string] | null) => void;
  onSortChange: (state: ReviewListSortState) => void;
}

const ReviewFilterBar: React.FC<ReviewFilterBarProps> = ({
  mode,
  reviewerOptions,
  uploaderOptions = [],
  deptFilter,
  uploaderFilter,
  reviewerFilter,
  fileTypeFilter,
  fileExistenceFilter,
  dateRange,
  sortState = REVIEW_LIST_SORT_DEFAULT,
  onDeptChange,
  onUploaderChange,
  onReviewerChange,
  onFileTypeChange,
  onFileExistenceChange,
  onDateRangeChange,
  onSortChange,
}) => {
  const { settings, loaded } = useSettingsStore();

  const fileTypeTree = useMemo(
    () => (loaded ? buildFileTypeTree(settings.allowedFileTypes || {}) : []),
    [settings.allowedFileTypes, loaded],
  );
  const handleDateRangeChange = useCallback(
    (range: [string, string] | null) => {
      onDateRangeChange(toDateRange(range));
    },
    [onDateRangeChange],
  );

  const handleSortFieldChange = useCallback(
    (field: ReviewSortField, order: ReviewSortOrder | undefined) => {
      if (order === undefined) {
        const next: ReviewListSortState = {
          ...sortState,
          ...(field === 'updatedAt' ? { updatedAtOrder: undefined } : { createdAtOrder: undefined }),
        };
        if (field === next.activeField) {
          next.activeField =
            next.updatedAtOrder != null ? 'updatedAt' : next.createdAtOrder != null ? 'createdAt' : 'updatedAt';
        }
        onSortChange(next);
        return;
      }
      onSortChange({
        ...sortState,
        activeField: field,
        ...(field === 'updatedAt' ? { updatedAtOrder: order } : { createdAtOrder: order }),
      });
    },
    [onSortChange, sortState],
  );

  // 不同 mode 下的筛选项可见性
  const showUploader = mode === 'all' || mode === 'pending';
  const showReviewer = mode === 'all' || mode === 'initiated';

  const filterList = [
    <FilterTreeSelect
      key="dept"
      filterKey="dept"
      label="部门"
      value={deptFilter}
      onChange={(v) => onDeptChange(v as string | undefined)}
      showSearch
    />,
    <FilterTreeSelect
      key="fileType"
      filterKey="fileType"
      label="文件类型"
      treeData={fileTypeTree}
      autoLoadDept={false}
      multiple
      value={fileTypeFilter}
      onChange={(v) => onFileTypeChange(v as string[] | undefined)}
    />,
    <FilterSelect
      key="uploader"
      filterKey="uploader"
      label="提交人"
      variant="person"
      options={uploaderOptions}
      value={uploaderFilter}
      onChange={(v) => onUploaderChange(v as string | undefined)}
      searchable
      hidden={!showUploader}
    />,
    <FilterSelect
      key="reviewer"
      filterKey="reviewer"
      label="审核人"
      variant="person"
      options={reviewerOptions}
      value={reviewerFilter}
      onChange={(v) => onReviewerChange(v as string | undefined)}
      searchable
      hidden={!showReviewer}
    />,
    <FilterSelect
      key="fileExistence"
      filterKey="fileExistence"
      label="文件状态"
      options={FILE_EXISTENCE_FILTER_OPTIONS}
      value={fileExistenceFilter}
      onChange={(v) => onFileExistenceChange(v as FileExistenceStatus | undefined)}
    />,
    <FilterDateRange
      key="dateRange"
      filterKey="dateRange"
      label="日期范围"
      value={dateRange}
      onChange={handleDateRangeChange}
    />,
    <FilterSelect
      key="sortUpdatedAt"
      filterKey="sortUpdatedAt"
      label="更新时间"
      options={REVIEW_SORT_ORDER_OPTIONS}
      value={sortState.updatedAtOrder}
      onChange={(v) => handleSortFieldChange('updatedAt', v as ReviewSortOrder | undefined)}
    />,
    <FilterSelect
      key="sortCreatedAt"
      filterKey="sortCreatedAt"
      label="提交时间"
      options={REVIEW_SORT_ORDER_OPTIONS}
      value={sortState.createdAtOrder}
      onChange={(v) => handleSortFieldChange('createdAt', v as ReviewSortOrder | undefined)}
    />,
  ];

  return <CommonFilter label="筛选" list={filterList} />;
};

export default ReviewFilterBar;
