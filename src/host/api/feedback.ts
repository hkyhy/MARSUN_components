import request from '@/utils/request';

export const feedbackApi = {
  list: (params?: Record<string, unknown>) => request.get('/feedbacks', { params }),
  get: (id: string) => request.get(`/feedbacks/${id}`),
  create: (data: Record<string, unknown>) => request.post('/feedbacks', data),
  update: (id: string, data: Record<string, unknown>) => request.put(`/feedbacks/${id}`, data),
  delete: (id: string) => request.delete(`/feedbacks/${id}`),
  records: (id: string) => request.get(`/feedbacks/${id}/records`),
  getComments: (id: string) => request.get(`/feedbacks/${id}/comments`),
  addComment: (id: string, data: { content: string; parentId?: string }) =>
    request.post(`/feedbacks/${id}/comments`, data),
  assigneeOptions: () => request.get('/feedbacks/assignee-options'),
};
