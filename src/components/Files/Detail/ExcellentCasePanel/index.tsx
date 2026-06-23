import { fileApi } from '@/api';
import { SEMANTIC_COLORS, SemanticTag } from '@/components/Common';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';
import { Button, Card, message, Switch } from 'antd';
import React, { useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ExcellentCasePanelProps {
  fileId: string;
  isExcellentCase?: boolean;
  editable?: boolean;
  onUpdated?: () => void;
}

const ExcellentCasePanel: React.FC<ExcellentCasePanelProps> = ({
  fileId,
  isExcellentCase = false,
  editable,
  onUpdated,
}) => {
  const { hasAnyRole } = useAuthStore();
  const [checked, setChecked] = useState(isExcellentCase);
  const [loading, setLoading] = useState(false);

  const canEdit = editable ?? hasAnyRole([UserRole.REVIEWER, UserRole.SYSTEM_ADMIN]);

  const handleChange = async (value: boolean) => {
    setLoading(true);
    try {
      await fileApi.updateExcellentCase(fileId, value);
      setChecked(value);
      message.success(value ? '已标记为优秀案例' : '已取消优秀案例');
      onUpdated?.();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      message.error(axiosErr?.response?.data?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card size="small" title="优秀案例" className={classNames('excellent-case-panel-panel-card', styles['excellent-case-panel-panel-card'])}>
      <div className={classNames('excellent-case-panel-excellent-case-row', styles['excellent-case-panel-excellent-case-row'])}>
        <SemanticTag color={checked ? SEMANTIC_COLORS.SUCCESS : SEMANTIC_COLORS.DEFAULT}>
          {checked ? '是' : '否'}
        </SemanticTag>
        {canEdit && (
          <Switch
            checked={checked}
            loading={loading}
            checkedChildren="优秀"
            unCheckedChildren="普通"
            onChange={handleChange}
          />
        )}
      </div>
      {canEdit && (
        <Button type="link" size="small" className={classNames('excellent-case-panel-quota-link', styles['excellent-case-panel-quota-link'])} disabled>
          每位审核员每月最多标记 5 个
        </Button>
      )}
    </Card>
  );
};

export default ExcellentCasePanel;
