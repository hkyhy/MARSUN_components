import { Form, Input, Select } from 'antd';
import React from 'react';
import { CATEGORY_OPTIONS } from '../constants';

interface CreateFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

/** 创建反馈表单（纯字段，不含提交逻辑） */
const CreateForm: React.FC<CreateFormProps> = ({ form }) => (
  <Form form={form} layout="vertical">
    <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
      <Input placeholder="请输入反馈标题" />
    </Form.Item>
    <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
      <Select placeholder="请选择" options={CATEGORY_OPTIONS} />
    </Form.Item>
    <Form.Item
      name="description"
      label="详细描述"
      rules={[{ required: true, message: '请输入描述' }]}
    >
      <Input.TextArea rows={4} placeholder="请详细描述反馈内容" />
    </Form.Item>
  </Form>
);

export default CreateForm;
