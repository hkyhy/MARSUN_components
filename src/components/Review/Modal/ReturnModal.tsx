import { Undo2 } from '@/icons';
import { Form, Modal } from 'antd';
import React from 'react';
import { ReturnForm } from '../Form';

interface ReturnModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onOk: (values: { reason: string; comment?: string }) => Promise<void>;
}

const ReturnModal: React.FC<ReturnModalProps> = ({ open, loading, onCancel, onOk }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onOk(values);
      form.resetFields();
    } catch {
      // validation
    }
  };

  return (
    <Modal
      title="退回修改"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确认退回"
      okButtonProps={{ icon: <Undo2 /> }}
      destroyOnClose
    >
      <ReturnForm form={form} />
    </Modal>
  );
};

export default ReturnModal;
