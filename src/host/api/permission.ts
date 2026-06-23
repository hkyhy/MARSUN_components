import type { PermissionDefinitionsResponse, RoleOptionsPayload } from '@/types';
import request from '@/utils/request';

export const permissionApi = {
  roles: () => request.get('/permissions/roles'),
  permissions: () =>
    request.get<{ code: number; data: PermissionDefinitionsResponse }>('/permissions/permissions'),
  roleOptions: () =>
    request.get<{ code: number; data: RoleOptionsPayload }>('/permissions/role-options'),
  createRole: (data: { key: string; label: string; description?: string; permissions: string[] }) =>
    request.post('/permissions/roles', data),
  updateRole: (
    role: string,
    data: { label?: string; description?: string; permissions: string[] },
  ) => request.put(`/permissions/roles/${role}`, data),
  deleteRole: (role: string) => request.delete(`/permissions/roles/${role}`),
  reviewers: () => request.get('/permissions/reviewers'),
};
