import { getCompletionUrl } from '@/api';
import { normalizeCitation } from '@/components/AgentHub/Chat/utils/citationContent';
import { useAuthStore } from '@/stores/authStore';
import type { Citation } from '@/types';
import { useCallback, useRef, useState } from 'react';

export interface SSECompletionOptions {
  chatId: string;
  onChunk?: (text: string) => void;
  onCitations?: (citations: Citation[]) => void;
  onDone?: () => void;
  onError?: (err: string) => void;
}

export const useSSECompletion = (chatId: string) => {
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (
      messages: { role: 'user' | 'assistant'; content: string }[],
      onChunk: (text: string) => void,
      onCitations: (citations: Citation[]) => void,
      onDone: () => void,
      onError: (err: string) => void,
      sessionId?: string,
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStreaming(true);

      const token = useAuthStore.getState().token;
      const url = getCompletionUrl(chatId);

      // Native RAGFlow endpoint uses `question` (last user message); session keeps history server-side
      const question = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            question,
            stream: true,
            session_id: sessionId,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errText = await res.text();
          onError(errText || `HTTP ${res.status}`);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          onError('无法读取响应流');
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let latestCitations: Citation[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;

            const payload = trimmed.slice(5).trim();

            try {
              // Native RAGFlow SSE format:
              //   chunk = { code, message, data: { answer, reference, final, ... } }
              //   done  = { code, message, data: true }
              const envelope = JSON.parse(payload) as {
                code: number;
                message?: string;
                data: { answer?: string; reference?: { chunks?: Citation[] } } | true;
              };

              if (envelope.code !== 0) {
                onError(envelope.message ?? '请求失败');
                return;
              }

              // done signal
              if (envelope.data === true) {
                onDone();
                return;
              }

              const chunk = envelope.data as {
                answer?: string;
                reference?: { chunks?: Citation[] };
              };

              if (typeof chunk.answer === 'string' && chunk.answer.length > 0) {
                onChunk(chunk.answer);
              }

              if (chunk.reference?.chunks?.length) {
                latestCitations = chunk.reference.chunks!.map((item) =>
                  normalizeCitation(item as unknown as Record<string, unknown>),
                );
                onCitations(latestCitations);
              }
            } catch {
              // skip malformed JSON lines
            }
          }
        }

        onDone();
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
        onError((err as Error)?.message ?? '请求失败');
      } finally {
        setStreaming(false);
      }
    },
    [chatId],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, []);

  return { streaming, send, abort };
};
