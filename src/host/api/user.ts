import type { PaginatedResponse, UserInfo } from '@/types';
import request from '@/utils/request';

export const userApi = {
  list: (params?: Record<string, unknown>) =>
    request.get<{ code: number; data: PaginatedResponse<UserInfo> }>('/users', { params }),
  get: (id: string) => request.get<{ code: number; data: UserInfo }>(`/users/${id}`),
  uploaders: (params?: Record<string, unknown>) =>
    request.get<{
      code: number;
      data: {
        value: string;
        label: string;
        departmentId?: string;
        departmentName?: string;
        email?: string;
        phone?: string;
        employeeId?: string;
      }[];
    }>('/users/uploaders', {
      params,
    }),
  create: (data: Partial<UserInfo> & { password: string }) => request.post('/users', data),
  update: (id: string, data: Partial<UserInfo>) => request.put(`/users/${id}`, data),
  updateStatus: (
    id: string,
    data: {
      memberStatus: string;
      statusRemark?: string;
      resignedAt?: string;
      resignedAttachment?: string;
    },
  ) => request.put(`/users/${id}/status`, data),
  delete: (id: string) => request.delete(`/users/${id}`),
  import: (data: {
    users: {
      employeeId: string;
      displayName: string;
      email?: string;
      phone?: string;
      departmentName: string;
      role?: string;
      password?: string;
    }[];
  }) => request.post('/users/import', data),
};
