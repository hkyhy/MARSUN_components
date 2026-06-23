import { MoveForm } from '@/components/Files/Form';
import { useAuthStore } from '@/stores/authStore';
import type { FileItem } from '@/types';
import { UserRole } from '@/types';
import { Form, Modal } from 'antd';
import React from 'react';

interface MoveModalProps {
  open: boolean;
  onOk: (targetFolderId: string | null) => void;
  onCancel: () => void;
  target: FileItem | null;
}

const MoveModal: React.FC<MoveModalProps> = ({ open, onOk, onCancel, target }) => {
  const [form] = Form.useForm();
  const { hasAnyRole } = useAuthStore();
  const isSystemAdmin = hasAnyRole([UserRole.SYSTEM_ADMIN]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk((values.targetFolderId as string) || null);
      form.resetFields();
    } catch {
      // 校验失败
    }
  };

  return (
    <Modal
      title={`移动「${target?.name}」到`}
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      destroyOnClose
    >
      <MoveForm
        form={form}
        currentId={target?.id}
        scopeDepartmentId={isSystemAdmin ? undefined : (target?.departmentId ?? undefined)}
        requireParent={target?.type === 'FOLDER'}
      />
    </Modal>
  );
};

export default MoveModal;
