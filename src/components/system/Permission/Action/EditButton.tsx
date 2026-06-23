import type { PermissionDefinitionsResponse, RoleConfig } from '@/types';
import { Button } from 'antd';
import React, { useState } from 'react';
import { RoleModal } from '../Modal';

interface EditButtonProps {
  role: RoleConfig;
  existingRoles: RoleConfig[];
  definitions: PermissionDefinitionsResponse | null;
  onSuccess: () => void;
  /** 受控模式：外部管理 open 状态，不渲染按钮 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const EditButton: React.FC<EditButtonProps> = ({
  role,
  existingRoles,
  definitions,
  onSuccess,
  open,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const modalOpen = isControlled ? open : internalOpen;

  const handleClose = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }
  };

  const handleOpen = () => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
    }
  };

  return (
    <>
      {!isControlled && (
        <Button type="link" size="small" onClick={handleOpen}>
          编辑
        </Button>
      )}
      <RoleModal
        open={modalOpen}
        editingRole={role}
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

export default EditButton;
