import { Form, Input, Switch } from 'antd';
import React from 'react';
import FolderTreeSelect from './FolderTreeSelect';

interface CreateFolderFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  /** 限定可选文件夹的部门范围 */
  scopeDepartmentId?: string;
}

/** 新建文件夹表单字段 */
const CreateFolderForm: React.FC<CreateFolderFormProps> = ({ form, scopeDepartmentId }) => {
  const isPublic = Form.useWatch('isPublic', form);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="文件夹名称"
        rules={[{ required: true, message: '请输入文件夹名称' }]}
      >
        <Input placeholder="请输入文件夹名称" />
      </Form.Item>
      <Form.Item
        name="isPublic"
        label="公共文件夹"
        valuePropName="checked"
        tooltip="公共文件夹脱离部门，从根目录创建，所有用户可见"
      >
        <Switch />
      </Form.Item>
      {!isPublic && (
        <Form.Item
          name="parentId"
          label="上级文件夹"
          rules={[{ required: true, message: '请选择上级文件夹' }]}
        >
          <FolderTreeSelect
            placeholder="选择上级文件夹"
            onlyApproved
            hideRoot
            scopeDepartmentId={scopeDepartmentId}
          />
        </Form.Item>
      )}
    </Form>
  );
};

export default CreateFolderForm;
