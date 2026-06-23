import { StatusChangeModal } from '@/components/System/Users';
import type { UserInfo } from '@/types';
import { UserRoundCog } from '@/icons';
import { Button } from 'antd';
import React, { useState } from 'react';

interface StatusChangeButtonProps {
  user: UserInfo;
  onSuccess: () => void;
  /** 受控模式：外部管理 open 状态，不渲染按钮 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** 变更状态按钮 + 弹窗（支持受控/非受控模式） */
const StatusChangeButton: React.FC<StatusChangeButtonProps> = ({
  user,
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

  return (
    <>
      {!isControlled && (
        <Button onClick={() => setInternalOpen(true)} icon={<UserRoundCog />}>
          变更状态
        </Button>
      )}
      <StatusChangeModal
        open={modalOpen}
        user={user}
        onCancel={handleClose}
        onSuccess={() => {
          handleClose();
          onSuccess();
        }}
      />
    </>
  );
};

export default StatusChangeButton;
