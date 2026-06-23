import { feedbackApi } from '@/api';
import { Form, message, Modal } from 'antd';
import React, { useState } from 'react';
import { CreateForm } from '../Form';

interface CreateModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 新建反馈弹窗 */
const CreateModal: React.FC<CreateModalProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await feedbackApi.create(values);
      message.success(`反馈「${values.title}」已提交`);
      form.resetFields();
      onSuccess();
    } catch {
      // validation or api error
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
      title="新建反馈"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={560}
      destroyOnClose
    >
      <CreateForm form={form} />
    </Modal>
  );
};

export default CreateModal;
