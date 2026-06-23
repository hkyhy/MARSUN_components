import { DepartmentSelect, RoleSelect } from '@/components/Common/Form';
import { Form, Input } from 'antd';
import React from 'react';

interface UserFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  showAddFields?: boolean;
  /** 编辑时当前所属部门 ID，下拉中显示"当前"标签 */
  currentDepartmentId?: string;
}

/** 用户表单字段（添加/编辑共用） */
const UserForm: React.FC<UserFormProps> = ({ form, showAddFields, currentDepartmentId }) => (
  <Form form={form} layout="vertical">
    <Form.Item
      name="employeeId"
      label="工号"
      rules={showAddFields ? [{ required: true, message: '请输入工号' }] : undefined}
    >
      <Input placeholder="请输入工号" disabled={!showAddFields} />
    </Form.Item>
    <Form.Item name="displayName" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
      <Input placeholder="请输入姓名" />
    </Form.Item>
    <Form.Item
      name="email"
      label="邮箱"
      rules={[{ type: 'email', message: '邮箱格式不正确' }]}
    >
      <Input placeholder="请输入邮箱" />
    </Form.Item>
    {showAddFields && (
      <Form.Item name="password" label="初始密码">
        <Input.Password placeholder="默认 hm+工号" />
      </Form.Item>
    )}
    {!showAddFields && (
      <Form.Item name="phone" label="电话">
        <Input placeholder="请输入电话" />
      </Form.Item>
    )}
    <Form.Item
      name="departmentId"
      label="所属部门"
      rules={[{ required: true, message: '请选择部门' }]}
    >
      <DepartmentSelect currentId={currentDepartmentId} />
    </Form.Item>
    <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
      <RoleSelect />
    </Form.Item>
  </Form>
);

export default UserForm;
