import { feedbackApi } from '@/api';
import type { FeedbackItem } from '@/types';
import { Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { AssigneeSelect } from '../Form';

interface TransferModalProps {
  open: boolean;
  record: FeedbackItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 转交负责人弹窗 */
const TransferModal: React.FC<TransferModalProps> = ({ open, record, onCancel, onSuccess }) => {
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
      await feedbackApi.update(record.id, {
        action: 'TRANSFER',
        assigneeId: values.assigneeId,
        comment: values.comment,
      });
      message.success('已转交负责人');
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
      title="转交负责人"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={440}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="assigneeId"
          label="新负责人"
          rules={[{ required: true, message: '请选择新负责人' }]}
        >
          <AssigneeSelect placeholder="请选择新负责人" />
        </Form.Item>
        <Form.Item name="comment" label="转交原因">
          <Input.TextArea rows={3} placeholder="请输入转交原因（选填）" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransferModal;
