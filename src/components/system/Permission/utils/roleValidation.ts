import { getRoleLabel } from '@/stores/roleOptionsStore';
import type { RoleConfig } from '@/types';
import type { Rule } from 'antd/es/form';

export const ROLE_KEY_PATTERN = /^[A-Z][A-Z0-9_]*$/;
export const ROLE_LABEL_MAX_LENGTH = 50;

/** 获取角色展示名称 */
export function getRoleDisplayName(role: RoleConfig): string {
  return role.name || getRoleLabel(role.key);
}

/** 角色标识校验规则（新增） */
export function buildRoleKeyRules(existingRoles: RoleConfig[]): Rule[] {
  return [
    { required: true, message: '请输入角色标识' },
    {
      validator: (_, value) => {
        const normalizedKey = value?.trim().toUpperCase();
        if (!normalizedKey) {
          return Promise.resolve();
        }
        if (!ROLE_KEY_PATTERN.test(normalizedKey)) {
          return Promise.reject(new Error('角色标识格式不正确，请使用英文大写+下划线'));
        }
        if (existingRoles.some((role) => role.key === normalizedKey)) {
          return Promise.reject(new Error('角色标识已存在'));
        }
        return Promise.resolve();
      },
    },
  ];
}

/** 角色名称校验规则（新增/编辑，含重名校验） */
export function buildRoleLabelRules(existingRoles: RoleConfig[], editingRoleKey?: string): Rule[] {
  return [
    { required: true, message: '请输入角色名称' },
    { max: ROLE_LABEL_MAX_LENGTH, message: `角色名称不能超过${ROLE_LABEL_MAX_LENGTH}个字符` },
    {
      validator: (_, value) => {
        const trimmed = value?.trim();
        if (!trimmed) {
          return Promise.resolve();
        }
        const duplicate = existingRoles.find((role) => {
          if (editingRoleKey && role.key === editingRoleKey) {
            return false;
          }
          return getRoleDisplayName(role) === trimmed;
        });
        if (duplicate) {
          return Promise.reject(new Error('角色名称已存在'));
        }
        return Promise.resolve();
      },
    },
  ];
}
