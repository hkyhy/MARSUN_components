import { permissionApi } from '@/api';
import type { RoleOptionsPayload } from '@/types';
import { create } from 'zustand';

interface RoleOptionsState {
  roleList: RoleOptionsPayload['roleList'] | null;
  roleMap: RoleOptionsPayload['roleMap'] | null;
  loading: boolean;
  fetchRoleOptions: () => Promise<RoleOptionsPayload>;
  getRoleLabel: (key: string) => string;
  getRoleSelectOptions: () => { value: string; label: string }[];
  clearRoleOptions: () => void;
}

let fetchPromise: Promise<RoleOptionsPayload> | null = null;

export const useRoleOptionsStore = create<RoleOptionsState>((set, get) => ({
  roleList: null,
  roleMap: null,
  loading: false,

  fetchRoleOptions: async () => {
    if (fetchPromise) return fetchPromise;

    set({ loading: true });
    fetchPromise = (async () => {
      try {
        const res = await permissionApi.roleOptions();
        const data = (res as unknown as { data: RoleOptionsPayload }).data;
        set({ roleList: data.roleList, roleMap: data.roleMap, loading: false });
        return data;
      } catch (err) {
        set({ loading: false });
        throw err;
      } finally {
        fetchPromise = null;
      }
    })();

    return fetchPromise;
  },

  getRoleLabel: (key) => {
    const { roleMap } = get();
    return roleMap?.[key] ?? key;
  },

  getRoleSelectOptions: () => {
    const { roleList } = get();
    return (roleList ?? []).map(({ key, name }) => ({ value: key, label: name }));
  },

  clearRoleOptions: () => {
    fetchPromise = null;
    set({ roleList: null, roleMap: null, loading: false });
  },
}));

/** 非 React 环境获取角色显示名 */
export function getRoleLabel(key: string): string {
  return useRoleOptionsStore.getState().getRoleLabel(key);
}
