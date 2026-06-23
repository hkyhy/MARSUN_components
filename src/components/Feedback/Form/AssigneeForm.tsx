import { Form } from 'antd';
import React from 'react';
import AssigneeSelect from './AssigneeSelect';

interface AssigneeFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  label?: string;
}

/** 指定负责人/转交表单 */
const AssigneeForm: React.FC<AssigneeFormProps> = ({ form, label = '负责人' }) => (
  <Form form={form} layout="vertical">
    <Form.Item
      name="assigneeId"
      label={label}
      rules={[{ required: true, message: `请选择${label}` }]}
    >
      <AssigneeSelect placeholder={`请选择${label}`} />
    </Form.Item>
  </Form>
);

export default AssigneeForm;
