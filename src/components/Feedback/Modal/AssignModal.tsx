import { feedbackApi } from '@/api';
import type { FeedbackItem } from '@/types';
import { Form, Modal, message } from 'antd';
import React, { useState } from 'react';
import { AssigneeSelect } from '../Form';

interface AssignModalProps {
  open: boolean;
  record: FeedbackItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 指定负责人弹窗 */
const AssignModal: React.FC<AssignModalProps> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    if (!record) return;
    try {
      const values = await form.validateFields();
      setLoading(true);
      await feedbackApi.update(record.id, { action: 'ASSIGN', assigneeId: values.assigneeId });
      message.success('已指定负责人');
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
      title="指定负责人"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={480}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="assigneeId"
          label="负责人"
          rules={[{ required: true, message: '请选择负责人' }]}
        >
          <AssigneeSelect placeholder="请选择负责人" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignModal;
