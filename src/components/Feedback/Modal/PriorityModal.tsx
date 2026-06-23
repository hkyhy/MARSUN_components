import { feedbackApi } from '@/api';
import type { FeedbackItem } from '@/types';
import { Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { PriorityForm } from '../Form';

interface PriorityModalProps {
  open: boolean;
  record: FeedbackItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 修改优先级弹窗（action 模式） */
const PriorityModal: React.FC<PriorityModalProps> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({ priority: record.priority || 'medium' });
    }
  }, [open, record, form]);

  const handleOk = async () => {
    if (!record) return;
    try {
      const values = await form.validateFields();
      setLoading(true);
      await feedbackApi.update(record.id, { action: 'PRIORITY_CHANGE', priority: values.priority });
      message.success('优先级已更新');
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
      title="修改优先级"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={400}
      destroyOnClose
    >
      <PriorityForm form={form} />
    </Modal>
  );
};

export default PriorityModal;
