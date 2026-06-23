import { Form, Modal } from 'antd';
import React from 'react';
import { ReviewForm } from '../Form';

interface ReviewModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (
    action: 'APPROVE' | 'REJECT' | 'RETURN',
    values: { comment?: string; reason?: string },
  ) => Promise<void>;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, loading, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleAction = async (action: 'APPROVE' | 'REJECT' | 'RETURN') => {
    try {
      const values = await form.validateFields();
      await onSubmit(action, values);
      form.resetFields();
    } catch {
      // validation
    }
  };

  return (
    <Modal
      title="文件审核"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={520}
      destroyOnClose
    >
      <ReviewForm form={form} loading={loading} onAction={handleAction} />
    </Modal>
  );
};

export default ReviewModal;
