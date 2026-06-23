import { fileApi } from '@/api';
import { SEMANTIC_COLORS, SemanticTag } from '@/components/Common';
import type { EffectStats } from '@/types';
import { UserRole } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { Button, Card, Descriptions, Input, message, Space } from 'antd';
import React, { useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface EffectStatsPanelProps {
  fileId: string;
  effectScore?: number;
  effectStats?: EffectStats | null;
  canRecord?: boolean;
  onUpdated?: () => void;
}

const EffectStatsPanel: React.FC<EffectStatsPanelProps> = ({
  fileId,
  effectScore = 0,
  effectStats,
  canRecord,
  onUpdated,
}) => {
  const { hasAnyRole } = useAuthStore();
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);

  const stats: EffectStats = effectStats ?? {
    citationCount: 0,
    likeCount: 0,
    citationScore: 0,
    likeScore: 0,
  };

  const showRecord = canRecord ?? hasAnyRole([UserRole.SYSTEM_ADMIN]);

  const handleRecord = async (eventType: 'CITATION' | 'LIKE') => {
    setLoading(true);
    try {
      await fileApi.recordEffect(fileId, {
        eventType,
        actorEmployeeId: employeeId || undefined,
      });
      message.success('录入成功');
      onUpdated?.();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      message.error(axiosErr?.response?.data?.message || '录入失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card size="small" title="效果统计" className={classNames('effect-stats-panel-panel-card', styles['effect-stats-panel-panel-card'])}>
      <Descriptions column={2} size="small">
        <Descriptions.Item label="智能体引用次数">{stats.citationCount} 次</Descriptions.Item>
        <Descriptions.Item label="获赞次数">{stats.likeCount} 次</Descriptions.Item>
        <Descriptions.Item label="引用累计分">{stats.citationScore} 分</Descriptions.Item>
        <Descriptions.Item label="获赞累计分">{stats.likeScore} 分</Descriptions.Item>
        <Descriptions.Item label="效果分合计" span={2}>
          <SemanticTag color={SEMANTIC_COLORS.INFO}>{effectScore} 分</SemanticTag>
        </Descriptions.Item>
      </Descriptions>
      {showRecord && (
        <div className={classNames('effect-stats-panel-record-section', styles['effect-stats-panel-record-section'])}>
          <TextHelper />
          <Space wrap className={classNames('effect-stats-panel-record-actions', styles['effect-stats-panel-record-actions'])}>
            <Input
              placeholder="操作人工号（可选，测试用）"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              style={{ width: 200 }}
            />
            <Button loading={loading} onClick={() => handleRecord('CITATION')}>
              录入引用
            </Button>
            <Button loading={loading} onClick={() => handleRecord('LIKE')}>
              录入获赞
            </Button>
          </Space>
        </div>
      )}
    </Card>
  );
};

const TextHelper: React.FC = () => (
  <span className={classNames('effect-stats-panel-record-hint', styles['effect-stats-panel-record-hint'])}>管理端测试录入，外部智能体对接请使用 API</span>
);

export default EffectStatsPanel;
