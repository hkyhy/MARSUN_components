import { Form, Input } from 'antd';
import React from 'react';

interface ResolutionFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  title?: string;
}

/** 解决方法/关闭原因表单 */
const ResolutionForm: React.FC<ResolutionFormProps> = ({ form, title = '解决方法' }) => (
  <Form form={form} layout="vertical">
    <Form.Item
      name="resolution"
      label={title}
      rules={[{ required: true, message: `请填写${title}` }]}
    >
      <Input.TextArea placeholder={`请填写${title}`} autoSize={{ minRows: 3, maxRows: 8 }} />
    </Form.Item>
  </Form>
);

export default ResolutionForm;
