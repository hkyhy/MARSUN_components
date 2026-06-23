import request from '@/utils/request';

export interface ListDatasetsParams {
  page?: number;
  pageSize?: number;
  name?: string;
  include_parsing_status?: boolean;
}

export interface CreateDatasetData {
  name: string;
  description?: string;
  embedding_model?: string;
  chunk_method?: string;
}

export interface ListDocumentsParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface ParseDocumentsData {
  document_ids: string[];
}

export interface CreateChatData {
  name: string;
  description?: string;
  dataset_ids?: string[];
  llm_id?: string;
  prompt_config?: {
    prologue?: string;
    system?: string;
    empty_response?: string;
  };
}

export interface ChatCompletionRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  stream?: boolean;
  session_id?: string;
}

export interface ListSessionsParams {
  page?: number;
  page_size?: number;
  orderby?: string;
  desc?: boolean;
  id?: string;
}

export interface CreateSessionData {
  name?: string;
}

export interface MessageFeedbackData {
  thumbup: boolean;
  feedback?: string;
}

export const agentHubApi = {
  // ── Knowledge Bases (Datasets) ──────────────────────────────────
  listDatasets: (params?: ListDatasetsParams) => request.get('/agent-hub/datasets', { params }),

  createDataset: (data: CreateDatasetData) => request.post('/agent-hub/datasets', data),

  updateDataset: (id: string, data: Partial<CreateDatasetData>) =>
    request.put(`/agent-hub/datasets/${id}`, data),

  deleteDataset: (id: string) => request.delete(`/agent-hub/datasets/${id}`),

  // ── Documents ───────────────────────────────────────────────────
  listDocuments: (datasetId: string, params?: ListDocumentsParams) =>
    request.get(`/agent-hub/datasets/${datasetId}/documents`, { params }),

  uploadDocument: (datasetId: string, formData: FormData) =>
    request.post(`/agent-hub/datasets/${datasetId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteDocument: (datasetId: string, docId: string) =>
    request.delete(`/agent-hub/datasets/${datasetId}/documents/${docId}`),

  parseDocuments: (datasetId: string, documentIds: string[]) =>
    request.post(`/agent-hub/datasets/${datasetId}/chunks`, {
      document_ids: documentIds,
    } as ParseDocumentsData),

  stopParsing: (datasetId: string, documentIds: string[]) =>
    request.delete(`/agent-hub/datasets/${datasetId}/chunks`, {
      data: { document_ids: documentIds },
    }),

  // ── Chat Assistants ─────────────────────────────────────────────
  listChats: (params?: { page?: number; pageSize?: number; name?: string }) =>
    request.get('/agent-hub/chats', { params }),

  createChat: (data: CreateChatData) => request.post('/agent-hub/chats', data),

  updateChat: (id: string, data: Partial<CreateChatData>) =>
    request.put(`/agent-hub/chats/${id}`, data),

  deleteChat: (id: string) => request.delete(`/agent-hub/chats/${id}`),

  // ── Sessions ────────────────────────────────────────────────────
  createSession: (chatId: string, data?: CreateSessionData) =>
    request.post(`/agent-hub/chats/${chatId}/sessions`, data),

  listSessions: (chatId: string, params?: ListSessionsParams) =>
    request.get(`/agent-hub/chats/${chatId}/sessions`, { params }),

  getSession: (chatId: string, sessionId: string) =>
    request.get(`/agent-hub/chats/${chatId}/sessions/${sessionId}`),

  deleteSession: (chatId: string, sessionId: string) =>
    request.delete(`/agent-hub/chats/${chatId}/sessions`, { data: { ids: [sessionId] } }),

  submitMessageFeedback: (
    chatId: string,
    sessionId: string,
    messageId: string,
    data: MessageFeedbackData,
  ) =>
    request.put(
      `/agent-hub/chats/${chatId}/sessions/${sessionId}/messages/${messageId}/feedback`,
      data,
    ),
};

/** SSE completions endpoint — used by useSSECompletion hook with fetch() */
export const getCompletionUrl = (chatId: string) => `/api/agent-hub/chats/${chatId}/completions`;
