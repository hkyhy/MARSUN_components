import { useAuthStore } from '@/stores/authStore';
import type { AuditLogItem, PaginatedResponse } from '@/types';
import request from '@/utils/request';
import axios from 'axios';

export const auditApi = {
  list: (params?: Record<string, unknown>) =>
    request.get<{ code: number; data: PaginatedResponse<AuditLogItem> }>('/audit-logs', { params }),
  exportCsv: async (params?: Record<string, unknown>) => {
    const token = useAuthStore.getState().token;
    const response = await axios.get('/api/audit-logs/export', {
      params,
      responseType: 'blob',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data as Blob;
  },
};
