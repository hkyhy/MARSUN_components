import CardTitleWithSubtitle from '@/components/Dashboard/common/CardTitleWithSubtitle';
import { getQuickEntryScopeText } from '@/components/Dashboard/constants/dataScopeDescriptions';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';
import ButtonGroup from '@kne/button-group';
import { Card } from 'antd';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickEntrySection: React.FC = () => {
  const { hasAnyRole, hasPermissionKey, user } = useAuthStore();
  const navigate = useNavigate();

  const quickEntryList: Record<string, unknown>[] = useMemo(
    () => [
      { children: '上传文件', onClick: () => navigate('/files/upload') },
      { children: '文件管理', onClick: () => navigate('/files/list') },
      {
        children: '审核中心',
        onClick: () => navigate('/review/pending'),
        hidden: !hasAnyRole([UserRole.REVIEWER, UserRole.SYSTEM_ADMIN]),
      },
      {
        children: '审核监督',
        onClick: () => navigate('/review/all'),
        hidden: !hasPermissionKey('review:manage') || hasAnyRole([UserRole.REVIEWER]),
      },
      {
        children: '审计日志',
        onClick: () => navigate('/audit'),
        hidden: !hasAnyRole([UserRole.SYSTEM_ADMIN]),
      },
    ],
    [hasAnyRole, hasPermissionKey, navigate],
  );

  return (
    <Card
      title={
        <CardTitleWithSubtitle
          title="快捷入口"
          subtitle={user?.role ? getQuickEntryScopeText(user.role) : undefined}
        />
      }
    >
      <ButtonGroup list={quickEntryList} />
    </Card>
  );
};

export default QuickEntrySection;
