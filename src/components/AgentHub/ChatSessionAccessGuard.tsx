import { PUBLIC_KNOWLEDGE_CHAT_ID } from '@/constants/agentHub';
import { useAuthStore } from '@/stores/authStore';
import { getAgentHubEntryPath, isAgentHubAdmin } from '@/utils/agentHubAccess';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

interface ChatSessionAccessGuardProps {
  children: React.ReactNode;
}

/** 非管理员仅可访问固定公共问答 chatId */
const ChatSessionAccessGuard: React.FC<ChatSessionAccessGuardProps> = ({ children }) => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuthStore();
  const role = user?.role;

  if (isAgentHubAdmin(role)) {
    return <>{children}</>;
  }

  if (chatId !== PUBLIC_KNOWLEDGE_CHAT_ID) {
    return <Navigate to={getAgentHubEntryPath(role)} replace />;
  }

  return <>{children}</>;
};

export default ChatSessionAccessGuard;
