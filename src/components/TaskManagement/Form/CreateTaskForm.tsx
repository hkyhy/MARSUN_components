import { Form, Input } from 'antd';
import React from 'react';

interface CreateTaskFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="fileId"
        label="文件 ID"
        rules={[{ required: true, message: '请输入文件 ID' }]}
      >
        <Input placeholder="请输入要评估的文件 UUID" />
      </Form.Item>
    </Form>
  );
};

export default CreateTaskForm;
