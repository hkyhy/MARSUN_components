import { FolderTreeSelect } from '@/components/Files/Form';
import { Form } from 'antd';
import React from 'react';

interface MoveFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  currentId?: string;
  /** 限定目标文件夹的部门范围（与源项 departmentId 一致） */
  scopeDepartmentId?: string;
  /** 业务文件夹移动时不允许选根目录 */
  requireParent?: boolean;
}

/** 移动文件表单字段 */
const MoveForm: React.FC<MoveFormProps> = ({
  form,
  currentId,
  scopeDepartmentId,
  requireParent,
}) => (
  <Form form={form} layout="vertical">
    <Form.Item
      name="targetFolderId"
      label="目标文件夹"
      rules={requireParent ? [{ required: true, message: '请选择目标上级文件夹' }] : undefined}
    >
      <FolderTreeSelect
        currentId={currentId}
        scopeDepartmentId={scopeDepartmentId}
        hideRoot={requireParent}
      />
    </Form.Item>
  </Form>
);

export default MoveForm;
