import { authApi } from '@/api';
import { ChangePasswordForm } from '@/components/Profile/Form';
import { Form, message, Modal } from 'antd';
import React, { useState } from 'react';

interface ChangePasswordModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

/** 修改密码弹窗（校验旧密码、新旧密码不一致、两次输入一致） */
const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await authApi.changePassword({ newPassword: values.newPassword });
      message.success('密码修改成功');
      form.resetFields();
      onSuccess?.();
      onCancel();
    } catch {
      /* 校验失败或请求失败，错误提示由拦截器处理 */
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="修改密码"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={480}
      destroyOnClose
    >
      <ChangePasswordForm form={form} />
    </Modal>
  );
};

export default ChangePasswordModal;
