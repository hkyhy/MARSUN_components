import { CircleX } from '@/icons';
import { Form, Modal } from 'antd';
import React from 'react';
import { RejectForm } from '../Form';

interface RejectModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onOk: (values: { reason: string; comment?: string }) => Promise<void>;
}

const RejectModal: React.FC<RejectModalProps> = ({ open, loading, onCancel, onOk }) => {
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
      title="审核驳回"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确认驳回"
      okButtonProps={{ danger: true, icon: <CircleX /> }}
      destroyOnClose
    >
      <RejectForm form={form} />
    </Modal>
  );
};

export default RejectModal;
