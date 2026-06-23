import type { PermissionDefinitionsResponse, RoleConfig } from '@/types';
import { Plus } from '@/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import { RoleModal } from '../Modal';

interface AddButtonProps {
  onSuccess: () => void;
  existingRoles: RoleConfig[];
  definitions: PermissionDefinitionsResponse | null;
  /** 受控模式：外部管理 open 状态，不渲染按钮 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddButton: React.FC<AddButtonProps> = ({
  onSuccess,
  existingRoles,
  definitions,
  open,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const modalOpen = isControlled ? open : internalOpen;

  const handleClose = () => {
    isControlled ? onOpenChange?.(false) : setInternalOpen(false);
  };

  return (
    <>
      {!isControlled && (
        <Button type="primary" icon={<Plus />} onClick={() => setInternalOpen(true)}>
          新增角色
        </Button>
      )}
      <RoleModal
        open={modalOpen}
        editingRole={null}
        existingRoles={existingRoles}
        definitions={definitions}
        onCancel={handleClose}
        onSuccess={() => {
          handleClose();
          onSuccess();
        }}
      />
    </>
  );
};

export default AddButton;
