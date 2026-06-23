import type { UserInfo } from '@/types';
import { getStoredUserPermissions } from '@/utils/permissionStorage';

/** 用户是否有指定权限（读取 localStorage 中当前用户角色的 permissions 列表） */
export function hasPermission(user: UserInfo | null, perm: string): boolean {
  if (!user) return false;
  const permissions = getStoredUserPermissions();
  if (!permissions) return false;
  return permissions.includes(perm);
}
