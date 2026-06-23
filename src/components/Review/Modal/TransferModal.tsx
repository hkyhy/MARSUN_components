import type { PersonOption } from '@/components/Common';
import { Form, Modal } from 'antd';
import React from 'react';
import { TransferForm } from '../Form';

interface TransferModalProps {
  open: boolean;
  reviewers: PersonOption[];
  loading?: boolean;
  onCancel: () => void;
  onOk: (values: { transferTo: string; reason: string }) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  open,
  reviewers,
  loading,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch {
      // validation
    }
  };

  return (
    <Modal
      title="转审"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <TransferForm form={form} reviewers={reviewers} />
    </Modal>
  );
};

export default TransferModal;
