import { UserFormModal } from '@/components/System/Users';
import type { UserInfo } from '@/types';
import { Pencil } from '@/icons';
import { Button } from 'antd';
import React, { useState } from 'react';

interface EditUserButtonProps {
  user: UserInfo;
  onSuccess: () => void;
  /** 受控模式：外部管理 open 状态，不渲染按钮 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** 编辑用户按钮 + 弹窗（支持受控/非受控模式） */
const EditUserButton: React.FC<EditUserButtonProps> = ({ user, onSuccess, open, onOpenChange }) => {
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

  return (
    <>
      {!isControlled && (
        <Button onClick={() => setInternalOpen(true)} type="primary" icon={<Pencil />}>
          编辑
        </Button>
      )}
      <UserFormModal
        open={modalOpen}
        editingUser={user}
        onCancel={handleClose}
        onSuccess={() => {
          handleClose();
          onSuccess();
        }}
      />
    </>
  );
};

export default EditUserButton;
