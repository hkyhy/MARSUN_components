import { useAuthStore } from '@/stores/authStore';
import type {
  DeptPointsStat,
  FileTypeStat,
  PaginatedResponse,
  PersonalPointsFile,
  PersonalPointsStat,
  StatisticsOverview,
  StatsFilterParams,
  UploadTrendPoint,
} from '@/types';
import request from '@/utils/request';
import axios from 'axios';

export const statsApi = {
  overview: () => request.get<{ code: number; data: StatisticsOverview }>('/statistics/overview'),
  departments: () => request.get('/statistics/departments'),
  uploadsTrend: (params?: StatsFilterParams & { days?: number }) =>
    request.get<{ code: number; data: UploadTrendPoint[] }>('/statistics/uploads-trend', {
      params,
    }),
  fileTypes: (params?: StatsFilterParams) =>
    request.get<{ code: number; data: FileTypeStat[] }>('/statistics/file-types', { params }),
  uploadVolumeRanking: (params?: StatsFilterParams & Record<string, unknown>) =>
    request.get('/statistics/rankings/upload-volume', { params }),
  qualityScoreRanking: (params?: StatsFilterParams & Record<string, unknown>) =>
    request.get('/statistics/rankings/quality-score', { params }),
  totalScoreRanking: (params?: StatsFilterParams & Record<string, unknown>) =>
    request.get('/statistics/rankings/total-score', { params }),
  pointsDepartments: (params?: StatsFilterParams) =>
    request.get<{ code: number; data: DeptPointsStat[] }>('/statistics/points/departments', {
      params,
    }),
  pointsPersonal: (params?: StatsFilterParams & { page?: number; pageSize?: number }) =>
    request.get<{ code: number; data: PaginatedResponse<PersonalPointsStat> }>(
      '/statistics/points/personal',
      { params },
    ),
  personalPointFiles: (userId: string, params?: StatsFilterParams) =>
    request.get<{ code: number; data: PersonalPointsFile[] }>(
      `/statistics/points/personal/${userId}/files`,
      { params },
    ),
  exportPointsUrl: (params: StatsFilterParams & { type: 'department' | 'personal' }) => {
    const search = new URLSearchParams(params as unknown as Record<string, string>).toString();
    return `/api/statistics/points/export?${search}`;
  },
  exportPoints: async (params: StatsFilterParams & { type: 'department' | 'personal' }) => {
    const token = useAuthStore.getState().token;
    const response = await axios.get('/api/statistics/points/export', {
      params,
      responseType: 'blob',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data as Blob;
  },
};
