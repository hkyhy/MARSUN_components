import type { RoleConfig } from '@/types';
import { Form, Input } from 'antd';
import React from 'react';
import { buildRoleKeyRules, buildRoleLabelRules } from '../../utils/roleValidation';
import styles from './style.module.scss';
import classNames from 'classnames';

interface FormProps {
  form: ReturnType<typeof Form.useForm>[0];
  isEdit: boolean;
  existingRoles: RoleConfig[];
  editingRoleKey?: string;
}

const RoleForm: React.FC<FormProps> = ({ form, isEdit, existingRoles, editingRoleKey }) => {
  return (
    <Form form={form} layout="vertical">
      <div className={classNames('form-icon', styles['form-icon'])}>
        {!isEdit && (
          <Form.Item name="key" label="角色标识" rules={buildRoleKeyRules(existingRoles)}>
            <Input placeholder="如：CUSTOM_ROLE（英文大写+下划线）" />
          </Form.Item>
        )}
        <Form.Item
          name="label"
          label="角色名称"
          rules={buildRoleLabelRules(existingRoles, editingRoleKey)}
        >
          <Input placeholder="请输入角色名称" maxLength={50} showCount />
        </Form.Item>
        <Form.Item name="description" label="角色描述">
          <Input placeholder="请输入角色描述" />
        </Form.Item>
      </div>
    </Form>
  );
};

export default RoleForm;
