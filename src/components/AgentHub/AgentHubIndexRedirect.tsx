import { useAuthStore } from '@/stores/authStore';
import { getAgentHubEntryPath } from '@/utils/agentHubAccess';
import React from 'react';
import { Navigate } from 'react-router-dom';

/** /agent-hub index 按角色重定向到对应入口 */
const AgentHubIndexRedirect: React.FC = () => {
  const { user } = useAuthStore();
  return <Navigate to={getAgentHubEntryPath(user?.role)} replace />;
};

export default AgentHubIndexRedirect;
