import { hasPermission } from '@/components/Common/Auth';
import { useAuthStore } from '@/stores/authStore';
import { Plus } from '@/icons';
import ButtonGroup from '@kne/button-group';
import React from 'react';

interface ManageActionButtonsProps {
  onCreate: () => void;
}

/** 管理页头部操作按钮组 */
const ManageActionButtons: React.FC<ManageActionButtonsProps> = ({ onCreate }) => {
  const { user } = useAuthStore();
  const canCreate = hasPermission(user, 'feedback:create');

  if (!canCreate) return null;

  const listArray: Record<string, unknown>[] = [
    { type: 'primary', icon: <Plus />, children: '新建反馈', onClick: onCreate },
  ];

  return <ButtonGroup list={listArray} />;
};

export default ManageActionButtons;
