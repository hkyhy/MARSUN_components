import request from '@/utils/request';

export const reviewApi = {
  pending: (params?: Record<string, unknown>) => request.get('/reviews/pending', { params }),
  done: (params?: Record<string, unknown>) => request.get('/reviews/done', { params }),
  received: (params?: Record<string, unknown>) => request.get('/reviews/received', { params }),
  all: (params?: Record<string, unknown>) => request.get('/reviews/all', { params }),
  submitted: (params?: Record<string, unknown>) => request.get('/reviews/submitted', { params }),
  detail: (fileId: string) => request.get(`/reviews/${fileId}/detail`),
  submit: (
    fileId: string,
    data: {
      action: string;
      needSecondReview?: boolean;
      secondReviewerId?: string;
      comment?: string;
      reason?: string;
    },
  ) => request.post(`/reviews/${fileId}`, data),
  batchReview: (data: {
    fileIds: string[];
    action: string;
    needSecondReview?: boolean;
    secondReviewerId?: string;
    comment?: string;
    reason?: string;
  }) => request.post('/reviews/batch', data),
  transfer: (fileId: string, data: { transferToId: string; reason: string }) =>
    request.post(`/reviews/${fileId}/transfer`, data),
  claim: (fileId: string) => request.post(`/reviews/${fileId}/claim`),
  release: (fileId: string) => request.post(`/reviews/${fileId}/release`),
};
