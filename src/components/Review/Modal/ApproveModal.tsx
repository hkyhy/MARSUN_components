import { CircleCheck } from '@/icons';
import { Form, Modal } from 'antd';
import React from 'react';
import { ApproveForm } from '../Form';

interface ApproveModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onOk: (values: {
    needSecondReview?: boolean;
    secondReviewerId?: string;
    comment?: string;
  }) => Promise<void>;
}

const ApproveModal: React.FC<ApproveModalProps> = ({ open, loading, onCancel, onOk }) => {
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
      title="审核通过"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确认通过"
      okButtonProps={{ icon: <CircleCheck /> }}
      destroyOnClose
    >
      <ApproveForm form={form} />
    </Modal>
  );
};

export default ApproveModal;
