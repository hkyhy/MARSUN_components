import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types';
import { hasPermission as checkPermission } from './hasPermission';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  /** 允许访问的角色列表 */
  roles?: UserRole[];
  /** 允许访问的权限 key */
  permission?: string;
  children: React.ReactNode;
}

/**
 * 路由级别权限守卫
 * - 未登录重定向到登录页
 * - 角色/权限不匹配重定向到工作台
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, permission, children }) => {
  const { isAuthenticated, hasAnyRole, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !hasAnyRole(roles)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (permission && !checkPermission(user, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
