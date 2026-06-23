import { ImportModal } from '@/components/System/Department/Import';
import { Import } from '@/icons';
import { Button, Space } from 'antd';
import React, { useState } from 'react';
import AddButton from './AddButton';

interface ManageActionButtonsProps {
  canCreate: boolean;
  flatDepts: { id: string; name: string }[];
  onSuccess: () => void;
}

/** 批量导入按钮 */
const ImportButton: React.FC<{
  flatDepts: { id: string; name: string }[];
  onSuccess: () => void;
}> = ({ flatDepts, onSuccess }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon={<Import />} onClick={() => setOpen(true)}>
        批量导入
      </Button>
      <ImportModal
        open={open}
        flatDepts={flatDepts}
        onCancel={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          onSuccess();
        }}
      />
    </>
  );
};

/** 组织架构管理页头部操作按钮（新增部门 + 批量导入） */
const ManageActionButtons: React.FC<ManageActionButtonsProps> = ({
  canCreate,
  flatDepts,
  onSuccess,
}) => {
  if (!canCreate) return null;

  return (
    <Space>
      <AddButton onSuccess={onSuccess} />
      <ImportButton flatDepts={flatDepts} onSuccess={onSuccess} />
    </Space>
  );
};

export default ManageActionButtons;
