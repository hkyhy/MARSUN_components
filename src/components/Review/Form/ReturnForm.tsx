import { Form, Input } from 'antd';
import React from 'react';

interface ReturnFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

const ReturnForm: React.FC<ReturnFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="reason"
        label="退回原因"
        rules={[{ required: true, message: '请输入退回原因' }]}
      >
        <Input.TextArea rows={3} placeholder="请输入退回原因" />
      </Form.Item>
      <Form.Item name="comment" label="审核意见">
        <Input.TextArea rows={2} placeholder="选填" />
      </Form.Item>
    </Form>
  );
};

export default ReturnForm;
