import { authApi, permissionApi } from '@/api';
import type { PermissionDefinitionsResponse, UserRolePermissions } from '@/types';

/** 登录/初始化时拉取用户角色权限与全量权限定义 */
export async function fetchAuthPermissions(): Promise<{
  userRolePermissions: UserRolePermissions;
  permissionDefinitions: PermissionDefinitionsResponse;
}> {
  const [myPermsRes, definitionsRes] = await Promise.all([
    authApi.getMyPermissions(),
    permissionApi.permissions(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myPermsData = (myPermsRes as any).data || myPermsRes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definitionsData = (definitionsRes as any).data || definitionsRes;

  return {
    userRolePermissions: myPermsData as UserRolePermissions,
    permissionDefinitions: definitionsData as PermissionDefinitionsResponse,
  };
}
