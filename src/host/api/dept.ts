import type { Department, PaginatedResponse, UserInfo } from '@/types';
import request from '@/utils/request';

export const deptApi = {
  tree: () => request.get<{ code: number; data: Department[] }>('/departments/tree'),
  list: () => request.get<{ code: number; data: Department[] }>('/departments'),
  /** 公开接口（无需认证），用于注册页部门选择 */
  publicTree: () =>
    request.get<{ code: number; data: Department[] }>('/departments/public-tree', {
      headers: { 'X-Skip-Error-Handler': 'true' },
    }),
  create: (data: Partial<Department>) => request.post('/departments', data),
  update: (id: string, data: Partial<Department>) => request.put(`/departments/${id}`, data),
  delete: (id: string) => request.delete(`/departments/${id}`),
  import: (data: {
    departments?: { name: string; parentName?: string; sort?: number }[];
    users?: {
      employeeId: string;
      displayName: string;
      email?: string;
      phone?: string;
      departmentName: string;
      role?: string;
      password?: string;
    }[];
  }) => request.post('/departments/import', data),
  members: (deptId: string, params?: Record<string, unknown>) =>
    request.get<{ code: number; data: PaginatedResponse<UserInfo> }>(`/users`, {
      params: { departmentId: deptId, ...params },
    }),
};
