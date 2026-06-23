import { permissionApi } from '@/api';
import type { PermissionDefinitionsResponse, RoleConfig } from '@/types';
import { Form, message, Modal } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { RoleForm } from '../Form';
import PermissionConfig from '../Form/PermissionConfig';
import { getRoleDisplayName } from '../utils/roleValidation';

interface RoleModalProps {
  open: boolean;
  editingRole: RoleConfig | null;
  existingRoles: RoleConfig[];
  definitions: PermissionDefinitionsResponse | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const RoleModal: React.FC<RoleModalProps> = ({
  open,
  editingRole,
  existingRoles,
  definitions,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const isEdit = !!editingRole;

  const validPermKeys = useMemo(
    () => new Set(definitions?.permissions.map((p) => p.key) ?? []),
    [definitions],
  );

  const filterValidPerms = (perms: string[]) => perms.filter((p) => validPermKeys.has(p));

  useEffect(() => {
    if (!open) return;
    if (editingRole) {
      setSelectedPerms(filterValidPerms(editingRole.permissions));
      form.setFieldsValue({
        key: editingRole.key,
        label: getRoleDisplayName(editingRole),
        description: '',
      });
    } else {
      setSelectedPerms([]);
      form.resetFields();
    }
  }, [open, editingRole, form, validPermKeys]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const permissions = filterValidPerms(selectedPerms);
      if (isEdit && editingRole) {
        await permissionApi.updateRole(editingRole.key, {
          label: values.label,
          description: values.description,
          permissions,
        });
        message.success('权限配置已保存');
      } else {
        await permissionApi.createRole({
          key: values.key,
          label: values.label,
          description: values.description,
          permissions,
        });
        message.success('角色创建成功');
      }
      form.resetFields();
      setSelectedPerms([]);
      onSuccess();
    } catch {
      // validation or api error
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedPerms([]);
    onCancel();
  };

  return (
    <Modal
      title={
        isEdit ? `编辑角色 - ${editingRole ? getRoleDisplayName(editingRole) : ''}` : '新增角色'
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={720}
      okText="保存"
      confirmLoading={saving}
      destroyOnClose
    >
      <RoleForm
        form={form}
        isEdit={isEdit}
        existingRoles={existingRoles}
        editingRoleKey={editingRole?.key}
      />
      <PermissionConfig
        selectedPerms={selectedPerms}
        onSelectedPermsChange={setSelectedPerms}
        currentRole={editingRole}
        definitions={definitions}
      />
    </Modal>
  );
};

export default RoleModal;
