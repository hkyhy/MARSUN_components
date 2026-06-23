import type { UserInfo, UserRolePermissions } from '@/types';
import request from '@/utils/request';

export const authApi = {
  login: (data: { employeeId: string; password: string }) =>
    request.post<{ code: number; data: { token: string; user: UserInfo } }>('/auth/login', data, {
      headers: { 'X-Skip-Error-Handler': 'true' },
    }),
  getMe: () => request.get<{ code: number; data: UserInfo }>('/auth/me'),
  getMyPermissions: () =>
    request.get<{ code: number; data: UserRolePermissions }>('/auth/my-permissions'),
  changePassword: (data: { newPassword: string }) => request.put('/auth/password', data),
  forgotPassword: (data: { employeeId: string; displayName: string; newPassword: string }) =>
    request.post('/auth/forgot-password', data, { headers: { 'X-Skip-Error-Handler': 'true' } }),
};
