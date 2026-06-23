import { hasPermission } from '@/components/Common/Auth';
import { useAuthStore } from '@/stores/authStore';
import ButtonGroup from '@kne/button-group';
import React from 'react';

interface ManageActionButtonsProps {
  onCreate: () => void;
  onRefresh: () => void;
}

/** 任务管理页头部操作按钮组 */
const ManageActionButtons: React.FC<ManageActionButtonsProps> = ({ onCreate, onRefresh }) => {
  const { user } = useAuthStore();

  const listArray: Record<string, unknown>[] = [
    {
      type: 'primary',
      children: '创建任务',
      hidden: !hasPermission(user, 'system:task:create'),
      onClick: onCreate,
    },
    { children: '刷新', onClick: onRefresh },
  ];

  return <ButtonGroup list={listArray} />;
};

export default ManageActionButtons;
