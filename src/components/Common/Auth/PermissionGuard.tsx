import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types';
import { hasPermission as checkPermission } from './hasPermission';
import React from 'react';

interface PermissionGuardProps {
  /** 允许访问的角色列表，为空则所有已登录用户可访问 */
  roles?: UserRole[];
  /** 允许访问的权限 key */
  permission?: string;
  /** 无权限时的回退内容 */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 根据角色/权限条件渲染子组件
 * - 不传 roles/permission 则所有已登录用户可见
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  roles,
  permission,
  fallback = null,
  children,
}) => {
  const { hasAnyRole, isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <>{fallback}</>;
  if (permission && !checkPermission(user, permission)) return <>{fallback}</>;
  if (roles && roles.length > 0 && !hasAnyRole(roles)) return <>{fallback}</>;

  return <>{children}</>;
};

export default PermissionGuard;
