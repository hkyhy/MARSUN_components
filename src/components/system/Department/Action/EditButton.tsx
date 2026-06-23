import { FormModal } from '@/components/System/Department/Modal';
import { Pencil } from '@/icons';
import { Button } from 'antd';
import React, { useState } from 'react';

interface EditButtonProps {
  dept: { id: string; name: string; parentId: string | null };
  onSuccess: () => void;
  /** 受控模式：外部管理 open 状态，不渲染按钮 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** 编辑部门按钮 + 弹窗（支持受控/非受控模式） */
const EditButton: React.FC<EditButtonProps> = ({ dept, onSuccess, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const modalOpen = isControlled ? open : internalOpen;

  const handleClose = () => {
    isControlled ? onOpenChange?.(false) : setInternalOpen(false);
  };

  return (
    <>
      {!isControlled && (
        <Button
          type="text"
          size="small"
          icon={<Pencil />}
          onClick={() => setInternalOpen(true)}
        />
      )}
      <FormModal
        open={modalOpen}
        editingDept={dept}
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
