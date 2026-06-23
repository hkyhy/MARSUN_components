import { deptApi } from '@/api';
import { DeptForm } from '@/components/System/Department/Form';
import { Form, message, Modal } from 'antd';
import React, { useEffect } from 'react';

interface FormModalProps {
  open: boolean;
  editingDept: { id: string; name: string; parentId: string | null } | null;
  onCancel: () => void;
  onSuccess: () => void;
  /** 默认上级部门 ID（从树节点新增时使用） */
  defaultParentId?: string;
  /** 上级部门是否禁用 */
  parentIdDisabled?: boolean;
}

/** 部门表单弹窗（新增/编辑共用） */
const FormModal: React.FC<FormModalProps> = ({
  open,
  editingDept,
  onCancel,
  onSuccess,
  defaultParentId,
  parentIdDisabled,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!editingDept;

  useEffect(() => {
    if (!open) return;
    if (editingDept) {
      form.setFieldsValue({ name: editingDept.name, parentId: editingDept.parentId || undefined });
    } else {
      form.resetFields();
      if (defaultParentId) {
        form.setFieldsValue({ parentId: defaultParentId });
      }
    }
  }, [open, editingDept, defaultParentId, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        await deptApi.update(editingDept.id, {
          name: values.name,
          parentId: values.parentId || null,
        });
        message.success('部门更新成功');
      } else {
        await deptApi.create({ name: values.name, parentId: values.parentId || undefined });
        message.success(`部门「${values.name}」创建成功`);
      }
      form.resetFields();
      onSuccess();
    } catch {
      /* validation */
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEdit ? '编辑部门' : '新增部门'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <DeptForm
        form={form}
        excludeId={editingDept?.id}
        defaultParentId={defaultParentId}
        parentIdDisabled={parentIdDisabled}
      />
    </Modal>
  );
};

export default FormModal;
