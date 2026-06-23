import { DepartmentSelect } from '@/components/Common/Form';
import { Form, Input } from 'antd';
import React from 'react';

interface DeptFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  /** 编辑时排除当前部门 */
  excludeId?: string;
  /** 默认上级部门 ID（从树节点新增时使用） */
  defaultParentId?: string;
  /** 上级部门是否禁用（从树节点新增时禁用） */
  parentIdDisabled?: boolean;
}

/** 部门表单字段（新增/编辑共用） */
const DeptForm: React.FC<DeptFormProps> = ({
  form,
  excludeId,
  defaultParentId: _defaultParentId,
  parentIdDisabled,
}) => (
  <Form form={form} layout="vertical">
    <Form.Item name="name" label="部门名称" rules={[{ required: true, message: '请输入部门名称' }]}>
      <Input placeholder="请输入部门名称" />
    </Form.Item>
    <Form.Item name="parentId" label="上级部门">
      <DepartmentSelect
        placeholder="选择上级部门（留空为顶级）"
        excludeId={excludeId}
        disabled={parentIdDisabled}
      />
    </Form.Item>
  </Form>
);

export default DeptForm;
