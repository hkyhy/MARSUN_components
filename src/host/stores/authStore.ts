import { LAST_ACTIVITY_STORAGE_KEY } from '@/constants/auth';
import type { PermissionDefinitionsResponse, UserInfo, UserRolePermissions } from '@/types';
import { UserRole } from '@/types';
import {
  loadPermissionDefinitions,
  loadUserRolePermissions,
  savePermissionDefinitions,
  saveUserRolePermissions,
} from '@/utils/permissionStorage';
import { create } from 'zustand';
import { useRoleOptionsStore } from './roleOptionsStore';

const USER_STORAGE_KEY = 'maoyang_user';

export { USER_ROLE_PERMISSIONS_KEY as PERMISSIONS_STORAGE_KEY } from '@/utils/permissionStorage';

function loadUser(): UserInfo | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: UserInfo | null) {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  userRolePermissions: UserRolePermissions | null;
  permissionDefinitions: PermissionDefinitionsResponse | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  setUser: (user: UserInfo) => void;
  setUserRolePermissions: (data: UserRolePermissions) => void;
  setPermissionDefinitions: (data: PermissionDefinitionsResponse) => void;
  clearPermissions: () => void;
  updateUser: (user: Partial<UserInfo>) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasPermissionKey: (perm: string) => boolean;
  isAdmin: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  user: loadUser(),
  userRolePermissions: loadUserRolePermissions(),
  permissionDefinitions: loadPermissionDefinitions(),
  isAuthenticated: !!localStorage.getItem('token'),

  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(Date.now()));
    saveUser(user);
    useRoleOptionsStore.getState().clearRoleOptions();
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY);
    saveUser(null);
    saveUserRolePermissions(null);
    savePermissionDefinitions(null);
    useRoleOptionsStore.getState().clearRoleOptions();
    set({
      token: null,
      user: null,
      userRolePermissions: null,
      permissionDefinitions: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => {
    saveUser(user);
    set({ user, isAuthenticated: true });
  },

  setUserRolePermissions: (data) => {
    saveUserRolePermissions(data);
    set({ userRolePermissions: data });
  },

  setPermissionDefinitions: (data) => {
    savePermissionDefinitions(data);
    set({ permissionDefinitions: data });
  },

  clearPermissions: () => {
    saveUserRolePermissions(null);
    savePermissionDefinitions(null);
    set({ userRolePermissions: null, permissionDefinitions: null });
  },

  updateUser: (partial) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, ...partial };
      saveUser(updated);
      set({ user: updated });
    }
  },

  hasRole: (role) => {
    const user = get().user;
    return user?.role === role;
  },

  hasAnyRole: (roles) => {
    const user = get().user;
    return !!user?.role && roles.includes(user.role as UserRole);
  },

  hasPermissionKey: (perm) => {
    const permissions =
      get().userRolePermissions?.permissions ?? loadUserRolePermissions()?.permissions;
    return !!permissions && permissions.includes(perm);
  },

  get isAdmin() {
    const user = get().user;
    return user?.role === UserRole.SYSTEM_ADMIN || user?.role === UserRole.DEPT_LEADER;
  },
}));
