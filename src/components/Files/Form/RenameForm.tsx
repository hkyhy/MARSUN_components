import { Form, Input } from 'antd';
import React from 'react';

interface RenameFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  defaultName?: string;
  /** 同级文件夹/文件名称列表，用于重名校验 */
  siblingNames?: string[];
}

/** 重命名表单字段 */
const RenameForm: React.FC<RenameFormProps> = ({ form, defaultName, siblingNames = [] }) => (
  <Form form={form} layout="vertical">
    <Form.Item
      name="name"
      label="名称"
      rules={[
        { required: true, message: '请输入新名称' },
        {
          validator: (_, value) => {
            if (value && value !== defaultName && siblingNames.includes(value)) {
              return Promise.reject(new Error('同级已存在相同名称，请使用其他名称'));
            }
            return Promise.resolve();
          },
        },
      ]}
      initialValue={defaultName}
    >
      <Input placeholder="请输入新名称" />
    </Form.Item>
  </Form>
);

export default RenameForm;
