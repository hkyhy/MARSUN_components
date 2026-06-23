import { feedbackApi } from '@/api';
import type { FeedbackItem } from '@/types';
import { Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface CloseModalProps {
  open: boolean;
  record: FeedbackItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 关闭反馈弹窗（需填写关闭原因） */
const CloseModal: React.FC<CloseModalProps> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = async () => {
    if (!record) return;
    try {
      const values = await form.validateFields();
      setLoading(true);
      await feedbackApi.update(record.id, { action: 'CLOSE', resolution: values.resolution });
      message.success('反馈已关闭');
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
      title="关闭反馈"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={440}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="resolution"
          label="关闭原因"
          rules={[{ required: true, message: '请输入关闭原因' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入关闭原因" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CloseModal;
