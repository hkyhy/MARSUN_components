import { useAuthStore } from '@/stores/authStore';
import { getAgentHubEntryPath, isAgentHubAdmin } from '@/utils/agentHubAccess';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface AgentHubAccessGuardProps {
  mode: 'admin-only' | 'chat-manage';
  children: React.ReactNode;
}

/**
 * 智能中枢路由守卫
 * - admin-only：仅 SYSTEM_ADMIN 可访问（文件库、知识库）
 * - chat-manage：助手管理列表仅管理员可访问
 */
const AgentHubAccessGuard: React.FC<AgentHubAccessGuardProps> = ({ mode, children }) => {
  const { user } = useAuthStore();
  const role = user?.role;

  if (isAgentHubAdmin(role)) {
    return <>{children}</>;
  }

  if (mode === 'admin-only' || mode === 'chat-manage') {
    return <Navigate to={getAgentHubEntryPath(role)} replace />;
  }

  return <>{children}</>;
};

export default AgentHubAccessGuard;
