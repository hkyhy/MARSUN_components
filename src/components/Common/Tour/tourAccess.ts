import { hasPermission } from '@/components/Common/Auth/hasPermission';
import type { UserInfo } from '@/types';
import { UserRole } from '@/types';

export interface TourAccessContext {
  user: UserInfo;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasPermissionKey: (perm: string) => boolean;
  canSeeFolderManage: boolean;
  canSeeReviewManage: boolean;
  canSeeReviewPending: boolean;
  canSeeSystem: boolean;
  canSeeDept: boolean;
  canSeeUsers: boolean;
  canSeePermissionAdmin: boolean;
  canSeeBasicSettings: boolean;
  canSeeAudit: boolean;
  canSeeTasks: boolean;
  canSeeGlobalStats: boolean;
}

export function buildTourAccessContext(
  user: UserInfo,
  hasAnyRole: (roles: UserRole[]) => boolean,
  hasPermissionKey: (perm: string) => boolean,
): TourAccessContext {
  const canSeeFolderManage = hasAnyRole([UserRole.SYSTEM_ADMIN, UserRole.REVIEWER]);
  const canSeeReviewManage = hasPermissionKey('review:manage');
  const canSeeReviewPending = hasAnyRole([UserRole.REVIEWER, UserRole.SYSTEM_ADMIN]);
  const canSeeDept = hasPermission(user, 'dept:view');
  const canSeeUsers = hasPermission(user, 'user:view');
  const canSeePermissionAdmin = hasAnyRole([UserRole.SYSTEM_ADMIN]);
  const canSeeBasicSettings = hasAnyRole([UserRole.SYSTEM_ADMIN]);
  const canSeeSystem = canSeeDept || canSeeUsers || canSeePermissionAdmin || canSeeBasicSettings;
  const canSeeAudit = hasAnyRole([UserRole.SYSTEM_ADMIN]);
  const canSeeTasks = hasPermissionKey('system:task:view');
  const canSeeGlobalStats = hasPermissionKey('stats:global');

  return {
    user,
    hasAnyRole,
    hasPermissionKey,
    canSeeFolderManage,
    canSeeReviewManage,
    canSeeReviewPending,
    canSeeSystem,
    canSeeDept,
    canSeeUsers,
    canSeePermissionAdmin,
    canSeeBasicSettings,
    canSeeAudit,
    canSeeTasks,
    canSeeGlobalStats,
  };
}

export function getTourCompletedKey(userId: string, role: string): string {
  return `maoyang-tour-completed-${userId}-${role}`;
}
