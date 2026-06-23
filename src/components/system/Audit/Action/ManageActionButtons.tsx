import ButtonGroup from '@kne/button-group';
import React from 'react';
import { exportAuditLogs } from './handlers';

interface ManageActionButtonsProps {
  exportParams: Record<string, string>;
}

/** 审计日志页头部操作按钮组 */
const ManageActionButtons: React.FC<ManageActionButtonsProps> = ({ exportParams }) => {
  const listArray: Record<string, unknown>[] = [
    {
      children: '导出审计日志',
      type: 'primary',
      onClick: () => exportAuditLogs(exportParams),
    },
  ];

  return <ButtonGroup list={listArray} />;
};

export default ManageActionButtons;
