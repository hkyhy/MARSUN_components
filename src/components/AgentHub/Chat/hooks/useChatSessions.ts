/* eslint-disable @typescript-eslint/no-explicit-any */
import { agentHubApi } from '@/api';
import type { ChatMessage, ChatSession } from '@/types';
import { message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { parseSessionMessages, toDisplayMessages } from '../utils/sessionMessages';

const parseSessionList = (res: any): ChatSession[] => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.sessions)) return res.data.sessions;
  return [];
};

const parseSessionDetail = (res: any): ChatSession | null => {
  const data = res?.data ?? res;
  if (Array.isArray(data)) return data[0] ?? null;
  if (!data?.id) return null;
  return data;
};

const fetchSessionDetail = async (
  chatId: string,
  targetSessionId: string,
): Promise<ChatSession | null> => {
  try {
    const res = (await agentHubApi.getSession(chatId, targetSessionId)) as any;
    const detail = parseSessionDetail(res);
    if (detail && (detail.messages?.length || detail.message?.length)) {
      return detail;
    }
  } catch {
    // RAGFlow 部分版本未实现 GET /sessions/{id}，回退到 list + id 过滤
  }

  const listRes = (await agentHubApi.listSessions(chatId, {
    id: targetSessionId,
    page: 1,
    page_size: 1,
  })) as any;
  const list = parseSessionList(listRes);
  return list[0] ?? null;
};

export const useChatSessions = (chatId?: string) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const loadRequestIdRef = useRef(0);

  useEffect(() => {
    setSessions([]);
    setSessionId(undefined);
    loadRequestIdRef.current += 1;
  }, [chatId]);

  const invalidatePendingLoads = useCallback(() => {
    loadRequestIdRef.current += 1;
  }, []);

  const fetchSessions = useCallback(async () => {
    if (!chatId) return [] as ChatSession[];

    setSessionsLoading(true);
    try {
      const res = (await agentHubApi.listSessions(chatId, {
        page: 1,
        page_size: 50,
        orderby: 'update_time',
        desc: true,
      })) as any;
      const list = parseSessionList(res);
      setSessions(list);
      return list;
    } catch {
      return [];
    } finally {
      setSessionsLoading(false);
    }
  }, [chatId]);

  const loadSessionMessages = useCallback(
    async (
      targetSessionId: string,
      prologue?: string,
      options?: { quiet?: boolean },
    ): Promise<ChatMessage[]> => {
      if (!chatId) return [];

      const requestId = ++loadRequestIdRef.current;

      if (!options?.quiet) {
        setSessionLoading(true);
        setSessionId(targetSessionId);
      }
      try {
        const detail = await fetchSessionDetail(chatId, targetSessionId);
        if (requestId !== loadRequestIdRef.current) {
          return [];
        }

        if (!detail) {
          if (!options?.quiet) {
            message.error('会话不存在或已删除');
          }
          return [];
        }

        const parsed = parseSessionMessages(
          (detail.messages ?? detail.message ?? []) as any[],
          detail.reference ?? [],
        );

        const displayMessages = toDisplayMessages(parsed, prologue);

        if (requestId !== loadRequestIdRef.current) {
          return [];
        }

        return displayMessages;
      } catch {
        return [];
      } finally {
        if (!options?.quiet && requestId === loadRequestIdRef.current) {
          setSessionLoading(false);
        }
      }
    },
    [chatId],
  );

  const createNewSession = useCallback(
    async (name = '新会话') => {
      if (!chatId) return undefined;

      try {
        const res = (await agentHubApi.createSession(chatId, { name })) as any;
        const sid = res?.data?.id ?? res?.id;
        if (!sid) {
          message.error('创建会话失败');
          return undefined;
        }

        invalidatePendingLoads();
        setSessionId(sid);
        await fetchSessions();
        return sid as string;
      } catch {
        return undefined;
      }
    },
    [chatId, fetchSessions, invalidatePendingLoads],
  );

  const switchSession = useCallback(
    async (targetSessionId: string, prologue?: string) => {
      if (targetSessionId === sessionId) return [] as ChatMessage[];
      invalidatePendingLoads();
      return loadSessionMessages(targetSessionId, prologue);
    },
    [invalidatePendingLoads, loadSessionMessages, sessionId],
  );

  const deleteSessionById = useCallback(
    async (targetSessionId: string) => {
      if (!chatId) return false;

      try {
        await agentHubApi.deleteSession(chatId, targetSessionId);
        setSessions((prev) => prev.filter((item) => item.id !== targetSessionId));
        if (sessionId === targetSessionId) {
          invalidatePendingLoads();
          setSessionId(undefined);
        }
        return true;
      } catch {
        return false;
      }
    },
    [chatId, invalidatePendingLoads, sessionId],
  );

  const initializeSessions = useCallback(
    async (prologue?: string): Promise<{ messages: ChatMessage[]; sessionId?: string }> => {
      invalidatePendingLoads();
      const list = await fetchSessions();
      const latestSession = list[0];
      if (latestSession) {
        const messages = await loadSessionMessages(latestSession.id, prologue);
        return { messages, sessionId: latestSession.id };
      }

      const sid = await createNewSession();
      return { messages: [], sessionId: sid };
    },
    [createNewSession, fetchSessions, invalidatePendingLoads, loadSessionMessages],
  );

  return {
    sessions,
    sessionId,
    sessionsLoading,
    sessionLoading,
    fetchSessions,
    loadSessionMessages,
    createNewSession,
    switchSession,
    deleteSessionById,
    initializeSessions,
    invalidatePendingLoads,
    setSessionId,
  };
};
