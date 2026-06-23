import { userApi } from '@/api';
import { UserForm } from '@/components/System/Users/Form';
import type { UserInfo } from '@/types';
import { Form, message, Modal } from 'antd';
import React, { useEffect } from 'react';

interface UserFormModalProps {
  open: boolean;
  editingUser: UserInfo | null;
  onCancel: () => void;
  onSuccess: () => void;
  /** 默认部门ID（添加成员时使用） */
  defaultDeptId?: string;
  /** 是否显示工号+密码字段（添加时需要，编辑时不需要） */
  showAddFields?: boolean;
}

/** 用户表单弹窗（添加/编辑共用） */
const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  editingUser,
  onCancel,
  onSuccess,
  defaultDeptId,
  showAddFields,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!editingUser;

  useEffect(() => {
    if (!open) return;
    if (editingUser) {
      form.setFieldsValue({
        employeeId: editingUser.employeeId,
        displayName: editingUser.displayName,
        email: editingUser.email,
        phone: editingUser.phone,
        departmentId: editingUser.departmentId,
        role: editingUser.role,
      });
    } else {
      form.resetFields();
      if (defaultDeptId) {
        form.setFieldsValue({ departmentId: defaultDeptId });
      }
    }
  }, [open, editingUser, defaultDeptId, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        await userApi.update(editingUser.id, {
          displayName: values.displayName,
          email: values.email?.trim() || undefined,
          phone: values.phone,
          departmentId: values.departmentId,
          role: values.role,
        });
        message.success('更新成功');
      } else {
        await userApi.create({
          employeeId: values.employeeId,
          displayName: values.displayName || values.employeeId,
          email: values.email?.trim() || undefined,
          password: values.password || `hm${values.employeeId}`,
          role: values.role || 'NORMAL_USER',
          departmentId: values.departmentId,
        });
        message.success('创建成功');
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
      title={isEdit ? '编辑用户信息' : '添加用户'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <UserForm
        form={form}
        showAddFields={showAddFields}
        currentDepartmentId={editingUser?.departmentId}
      />
    </Modal>
  );
};

export default UserFormModal;
