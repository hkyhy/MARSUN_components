import type { FilterOption } from '@/components/Common';

export type ReviewSortOrder = 'desc' | 'asc';
export type ReviewSortField = 'updatedAt' | 'createdAt';

export interface ReviewListSortState {
  /** 当前生效的排序字段（最近一次选择） */
  activeField: ReviewSortField;
  /** 未选择时不展示「您已选择」标签 */
  updatedAtOrder?: ReviewSortOrder;
  createdAtOrder?: ReviewSortOrder;
}

/** 列表默认按更新时间倒序；筛选项初始为空，不展示标签 */
export const REVIEW_LIST_SORT_DEFAULT: ReviewListSortState = {
  activeField: 'updatedAt',
};

const API_SORT_FALLBACK = { sortBy: 'updatedAt' as const, sortOrder: 'desc' as const };

export const REVIEW_SORT_ORDER_OPTIONS: FilterOption[] = [
  { value: 'desc', label: '倒序' },
  { value: 'asc', label: '正序' },
];

export function toReviewListSortParams(state: ReviewListSortState): {
  sortBy: ReviewSortField;
  sortOrder: ReviewSortOrder;
} {
  const activeOrder =
    state.activeField === 'updatedAt' ? state.updatedAtOrder : state.createdAtOrder;
  if (activeOrder != null) {
    return { sortBy: state.activeField, sortOrder: activeOrder };
  }
  if (state.updatedAtOrder != null) {
    return { sortBy: 'updatedAt', sortOrder: state.updatedAtOrder };
  }
  if (state.createdAtOrder != null) {
    return { sortBy: 'createdAt', sortOrder: state.createdAtOrder };
  }
  return API_SORT_FALLBACK;
}
