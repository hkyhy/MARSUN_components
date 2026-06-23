import { PUBLIC_KNOWLEDGE_CHAT_ID } from '@/constants/agentHub';
import { UserRole } from '@/types';

export function isAgentHubAdmin(role?: string | null): boolean {
  return role === UserRole.SYSTEM_ADMIN;
}

export function getAgentHubEntryPath(role?: string | null): string {
  if (isAgentHubAdmin(role)) {
    return '/agent-hub/chat';
  }
  return `/agent-hub/chat/${PUBLIC_KNOWLEDGE_CHAT_ID}`;
}

export function getPublicKnowledgeChatPath(): string {
  return `/agent-hub/chat/${PUBLIC_KNOWLEDGE_CHAT_ID}`;
}

export function isRestrictedAgentHubPath(pathname: string, role?: string | null): boolean {
  if (isAgentHubAdmin(role)) {
    return false;
  }

  if (pathname === '/agent-hub/files' || pathname.startsWith('/agent-hub/files/')) {
    return true;
  }

  if (pathname === '/agent-hub/knowledge' || pathname.startsWith('/agent-hub/knowledge/')) {
    return true;
  }

  if (pathname === '/agent-hub/chat') {
    return true;
  }

  const chatIdMatch = pathname.match(/^\/agent-hub\/chat\/([^/]+)/);
  if (chatIdMatch && chatIdMatch[1] !== PUBLIC_KNOWLEDGE_CHAT_ID) {
    return true;
  }

  return false;
}
