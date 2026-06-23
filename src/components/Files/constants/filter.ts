import { UserRole } from '@/types';

/** 可展示部门筛选的角色（普通用户仅看自己文件，无需部门筛选） */
export const FILE_DEPT_FILTER_ROLES = [
  UserRole.SYSTEM_ADMIN,
  UserRole.REVIEWER,
  UserRole.DEPT_LEADER,
] as const;

/** 可展示提交人筛选的角色 */
export const FILE_UPLOADER_FILTER_ROLES = [
  UserRole.SYSTEM_ADMIN,
  UserRole.REVIEWER,
  UserRole.DEPT_LEADER,
] as const;

export function canShowFileDeptFilter(role?: string): boolean {
  return !!role && (FILE_DEPT_FILTER_ROLES as readonly string[]).includes(role);
}

export function canShowFileUploaderFilter(role?: string): boolean {
  return !!role && (FILE_UPLOADER_FILTER_ROLES as readonly string[]).includes(role);
}
