/** 筛选选项基础类型 */
export interface FilterOption {
  label: string;
  /** 值类型，根据使用场景可以是 string | number */
  value: string | number;
}

/** 人员筛选选项（含部门与联系方式，用于提交人/审核人等） */
export interface PersonOption extends FilterOption {
  departmentId?: string;
  departmentName?: string;
  email?: string;
  phone?: string;
  employeeId?: string;
}

/** 已选项 */
export interface SelectedItem {
  key: string;
  label: string;
  valueLabel: string;
  onRemove: () => void;
}

/** 所有筛选组件共用的 Props */
export interface BaseFilterProps {
  /** 筛选项唯一标识 */
  filterKey: string;
  /** 显示标签 */
  label: string;
  /** 是否有值（控制选中态样式） */
  active?: boolean;
  /** 是否隐藏，支持 boolean 或函数 */
  hidden?: boolean | (() => boolean);
}

/** 解析 hidden 属性 */
export function resolveHidden(hidden: boolean | (() => boolean) | undefined): boolean {
  if (hidden === undefined) return false;
  return typeof hidden === 'function' ? hidden() : hidden;
}


