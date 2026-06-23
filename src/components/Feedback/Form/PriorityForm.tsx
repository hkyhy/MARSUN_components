import { Form, Select } from 'antd';
import React from 'react';
import { PRIORITY_OPTIONS } from '../constants';

interface PriorityFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

/** 修改优先级表单（纯字段，不含提交逻辑） */
const PriorityForm: React.FC<PriorityFormProps> = ({ form }) => (
  <Form form={form} layout="vertical">
    <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
      <Select placeholder="请选择" options={PRIORITY_OPTIONS} />
    </Form.Item>
  </Form>
);

export default PriorityForm;
