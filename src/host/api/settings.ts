import type { PointConfig, ScoringModel } from '@/types';
import request from '@/utils/request';

export const settingsApi = {
  get: () => request.get<{ code: number; data: Record<string, string> }>('/settings'),
  update: (data: Record<string, string>) => request.put('/settings', data),
  getScoringModel: () =>
    request.get<{ code: number; data: ScoringModel }>('/settings/scoring-model'),
  updateScoringModel: (data: ScoringModel) => request.put('/settings/scoring-model', data),
  getPointConfig: () =>
    request.get<{ code: number; data: PointConfig }>('/settings/point-config'),
  updatePointConfig: (data: PointConfig) => request.put('/settings/point-config', data),
  getMaxFileSize: () =>
    request.get<{ code: number; data: { maxFileSize: number } }>('/settings/max-file-size'),
  getAllowedFileTypes: () =>
    request.get<{ code: number; data: { allowedFileTypes: Record<string, string[]> } }>(
      '/settings/allowed-file-types',
    ),
  uploadImage: (formData: FormData) =>
    request.post<{ code: number; data: { url: string } }>('/settings/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
