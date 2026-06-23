import type { AssessmentTaskStatus, FileItem, PaginatedResponse } from '@/types';
import request from '@/utils/request';
import type { AxiosRequestConfig } from 'axios';

export const fileApi = {
  list: (params?: Record<string, unknown>) =>
    request.get<{ code: number; data: PaginatedResponse<FileItem> }>('/files', { params }),
  get: (id: string) => request.get<{ code: number; data: FileItem }>(`/files/${id}`),
  upload: (formData: FormData, config?: AxiosRequestConfig) =>
    request.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
      ...config,
    }),
  importPublicFolder: (formData: FormData, config?: AxiosRequestConfig) =>
    request.post('/files/public-folder-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000,
      ...config,
    }),
  update: (id: string, data: Partial<FileItem>) => request.put(`/files/${id}`, data),
  delete: (id: string) => request.delete(`/files/${id}`),
  batchDelete: (ids: string[]) => request.post('/files/batch-delete', { ids }),
  batchSubmitReview: (ids: string[]) => request.post('/files/batch-submit-review', { ids }),
  batchRevokeReview: (ids: string[]) => request.post('/files/batch-revoke-review', { ids }),
  batchArchive: (ids: string[]) => request.post('/files/batch-archive', { ids }),
  download: (id: string) => `/api/files/${id}/download`,
  createFolder: (data: {
    name: string;
    parentId: string | null;
    departmentId?: string;
    isPublic?: boolean;
  }) => request.post('/files/folder', data),
  folders: (params?: { departmentId?: string }) =>
    request.get<{
      code: number;
      data: {
        id: string;
        name: string;
        parentId: string | null;
        departmentId: string;
        departmentName: string;
        isDepartmentFolder?: boolean;
        reviewStatus?: string;
      }[];
    }>('/files/folders', { params }),
  move: (id: string, targetFolderId: string | null) =>
    request.put(`/files/${id}/move`, { targetFolderId }),
  reupload: (id: string, formData: FormData) =>
    request.put(`/files/${id}/reupload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    }),
  submitReview: (id: string) => request.put(`/files/${id}/submit`),
  revokeReview: (id: string) => request.put(`/files/${id}/revoke`),
  archive: (id: string) => request.put(`/files/${id}/archive`),
  getEffects: (id: string) => request.get(`/files/${id}/effects`),
  recordEffect: (id: string, data: { eventType: 'CITATION' | 'LIKE'; actorEmployeeId?: string }) =>
    request.post(`/files/${id}/effects`, data),
  updateExcellentCase: (id: string, isExcellentCase: boolean) =>
    request.patch(`/files/${id}/excellent-case`, { isExcellentCase }),
  reassessQuality: (id: string) =>
    request.post<{ code: number; data: { taskId: string } }>(
      `/files/${id}/reassess-quality`,
      undefined,
      { timeout: 30000 },
    ),
  getAssessmentTaskStatus: (id: string) =>
    request.get<{
      code: number;
      data: {
        id: string;
        status: AssessmentTaskStatus;
        errorMsg: string | null;
        createdAt: string;
        finishedAt: string | null;
      } | null;
    }>(`/files/${id}/assessment-task-status`),
};
