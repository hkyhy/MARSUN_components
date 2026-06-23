import type { AssessmentTaskItem, PaginatedResponse } from '@/types';
import request from '@/utils/request';

export const assessmentTaskApi = {
  list: (params?: Record<string, unknown>) =>
    request.get<{ code: number; data: PaginatedResponse<AssessmentTaskItem> }>(
      '/assessment-tasks',
      { params },
    ),
  get: (id: string) =>
    request.get<{ code: number; data: AssessmentTaskItem }>(`/assessment-tasks/${id}`),
  create: (fileId: string) =>
    request.post<{ code: number; data: AssessmentTaskItem }>('/assessment-tasks', { fileId }),
  cancel: (id: string) =>
    request.put<{ code: number; message: string }>(`/assessment-tasks/${id}`, {
      status: 'CANCELLED',
    }),
  delete: (id: string) =>
    request.delete<{ code: number; message: string }>(`/assessment-tasks/${id}`),
  rerun: (id: string) =>
    request.post<{ code: number; data: AssessmentTaskItem }>(`/assessment-tasks/${id}/rerun`),
};
