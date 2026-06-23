import { UserImportModal } from '@/components/System/Users';
import { Import } from '@/icons';
import { Button } from 'antd';
import React, { useState } from 'react';

interface ImportUserButtonProps {
  deptNames: Set<string>;
  onSuccess: () => void;
}

/** 批量导入按钮 + 弹窗 */
const ImportUserButton: React.FC<ImportUserButtonProps> = ({ deptNames, onSuccess }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button icon={<Import />} onClick={() => setOpen(true)}>
        批量导入
      </Button>
      <UserImportModal
        open={open}
        deptNames={deptNames}
        onCancel={() => setOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default ImportUserButton;
