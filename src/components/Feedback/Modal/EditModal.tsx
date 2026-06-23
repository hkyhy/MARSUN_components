import { feedbackApi } from '@/api';
import type { FeedbackItem } from '@/types';
import { Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { CreateForm } from '../Form';

interface EditModalProps {
  open: boolean;
  record: FeedbackItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 编辑反馈弹窗（创建者编辑自己的待处理反馈） */
const EditModal: React.FC<EditModalProps> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        title: record.title,
        category: record.category,
        description: record.content,
      });
    }
  }, [open, record, form]);

  const handleOk = async () => {
    if (!record) return;
    try {
      const values = await form.validateFields();
      setLoading(true);
      await feedbackApi.update(record.id, { action: 'EDIT', ...values });
      message.success('反馈已更新');
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
      title="编辑反馈"
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

export default EditModal;
