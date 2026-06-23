import { Lock } from '@/icons';
import { Form, Input } from 'antd';
import React from 'react';

interface ChangePasswordFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

/** 修改密码表单字段（新密码 / 确认新密码，旧密码由后端校验） */
const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ form }) => (
  <Form form={form} layout="vertical" autoComplete="off">
    <Form.Item
      name="newPassword"
      label="新密码"
      rules={[
        { required: true, message: '请输入新密码' },
        { min: 6, message: '密码至少6位' },
      ]}
    >
      <Input.Password prefix={<Lock />} placeholder="新密码（至少6位）" />
    </Form.Item>
    <Form.Item
      name="confirmPassword"
      label="确认新密码"
      dependencies={['newPassword']}
      rules={[
        { required: true, message: '请确认新密码' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次密码不一致'));
          },
        }),
      ]}
    >
      <Input.Password prefix={<Lock />} placeholder="确认新密码" />
    </Form.Item>
  </Form>
);

export default ChangePasswordForm;
