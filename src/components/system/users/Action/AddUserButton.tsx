import { UserFormModal } from '@/components/System/Users';
import { Plus } from '@/icons';
import { Button } from 'antd';
import React, { useState } from 'react';

interface AddUserButtonProps {
  onSuccess: () => void;
  defaultDeptId?: string;
}

/** 添加用户按钮 + 弹窗 */
const AddUserButton: React.FC<AddUserButtonProps> = ({ onSuccess, defaultDeptId }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" icon={<Plus />} onClick={() => setOpen(true)}>
        添加用户
      </Button>
      <UserFormModal
        open={open}
        editingUser={null}
        showAddFields
        defaultDeptId={defaultDeptId}
        onCancel={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          onSuccess();
        }}
      />
    </>
  );
};

export default AddUserButton;
