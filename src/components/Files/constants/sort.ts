import type { FilterOption } from '@/components/Common';

export type FileSortOrder = 'desc' | 'asc';
export type FileSortField = 'updatedAt' | 'createdAt' | 'totalScore';

export interface FileListSortState {
  /** 当前生效的排序字段（最近一次选择） */
  activeField: FileSortField;
  /** 未选择时不展示「您已选择」标签 */
  updatedAtOrder?: FileSortOrder;
  createdAtOrder?: FileSortOrder;
  totalScoreOrder?: FileSortOrder;
}

/** 列表默认按更新时间倒序；筛选项初始为空，不展示标签 */
export const FILE_LIST_SORT_DEFAULT: FileListSortState = {
  activeField: 'updatedAt',
};

const API_SORT_FALLBACK = { sortBy: 'updatedAt' as const, sortOrder: 'desc' as const };

export const FILE_SORT_ORDER_OPTIONS: FilterOption[] = [
  { value: 'desc', label: '倒序' },
  { value: 'asc', label: '正序' },
];

export function toFileListSortParams(state: FileListSortState): {
  sortBy: FileSortField;
  sortOrder: FileSortOrder;
} {
  const orderMap: Record<FileSortField, FileSortOrder | undefined> = {
    updatedAt: state.updatedAtOrder,
    createdAt: state.createdAtOrder,
    totalScore: state.totalScoreOrder,
  };
  const activeOrder = orderMap[state.activeField];
  if (activeOrder != null) {
    return { sortBy: state.activeField, sortOrder: activeOrder };
  }
  if (state.updatedAtOrder != null) {
    return { sortBy: 'updatedAt', sortOrder: state.updatedAtOrder };
  }
  if (state.createdAtOrder != null) {
    return { sortBy: 'createdAt', sortOrder: state.createdAtOrder };
  }
  if (state.totalScoreOrder != null) {
    return { sortBy: 'totalScore', sortOrder: state.totalScoreOrder };
  }
  return API_SORT_FALLBACK;
}
