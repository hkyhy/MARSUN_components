import { FormModal } from '@/components/System/Department/Modal';
import { Plus } from '@/icons';
import { Button } from 'antd';
import React, { useState } from 'react';

interface AddButtonProps {
  onSuccess: () => void;
}

/** 新增部门按钮 + 弹窗 */
const AddButton: React.FC<AddButtonProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button icon={<Plus />} onClick={() => setOpen(true)} type="primary">
        新增部门
      </Button>
      <FormModal
        open={open}
        editingDept={null}
        onCancel={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          onSuccess();
        }}
      />
    </>
  );
};

export default AddButton;
