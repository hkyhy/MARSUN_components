import {
  Crown,
  Flame,
  Inbox,
  Star,
  Users,
  Trophy,
  User,
} from '@/icons';
import { Avatar, Card, Empty, Segmented, Space, Tag, Typography } from 'antd';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';
import type { LeaderboardItem } from '../types';

const { Text } = Typography;

interface TopFiveListProps {
  data: LeaderboardItem[];
  loading: boolean;
  dimension: 'department' | 'personal';
  onDimensionChange: (v: 'department' | 'personal') => void;
  scoreType: 'quality' | 'upload';
  onScoreTypeChange: (v: 'quality' | 'upload') => void;
}

const TopFiveList: React.FC<TopFiveListProps> = ({
  data,
  loading,
  dimension,
  onDimensionChange,
  scoreType,
  onScoreTypeChange,
}) => {
  /** 排名徽章 */
  const rankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <Avatar
          size={36}
          style={{ backgroundColor: '#FFF7E6', color: '#FAAD14' }}
          icon={<Crown />}
        />
      );
    if (rank === 2)
      return (
        <Avatar
          size={32}
          style={{ backgroundColor: '#F0F0F0', color: '#8C8C8C' }}
          icon={<Trophy fill="currentColor" strokeWidth={0} />}
        />
      );
    if (rank === 3)
      return (
        <Avatar
          size={28}
          style={{ backgroundColor: '#FFF1F0', color: '#CF1322' }}
          icon={<Star />}
        />
      );
    return (
      <Avatar size={24} style={{ backgroundColor: '#F5F5F5', color: '#8C8C8C' }}>
        {rank}
      </Avatar>
    );
  };

  return (
    <Card variant="borderless" className={classNames('top-five-list-top-five-card', styles['top-five-list-top-five-card'])} styles={{ body: { padding: '16px 20px' } }}>
      {/* 筛选栏 */}
      <div className={classNames('top-five-list-toolbar', styles['top-five-list-toolbar'])}>
        <Segmented
          value={dimension}
          onChange={(v) => onDimensionChange(v as 'department' | 'personal')}
          options={[
            {
              label: (
                <>
                  <Users /> 部门
                </>
              ),
              value: 'department',
            },
            {
              label: (
                <>
                  <User /> 个人
                </>
              ),
              value: 'personal',
            },
          ]}
        />
        <Segmented
          value={scoreType}
          onChange={(v) => onScoreTypeChange(v as 'quality' | 'upload')}
          options={[
            { label: '提交数量榜', value: 'upload' },
            { label: '总积分榜', value: 'quality' },
          ]}
          block={false}
        />
      </div>

      {/* 列表 */}
      {data.length === 0 && !loading ? (
        <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className={classNames('top-five-list-top-five-list', styles['top-five-list-top-five-list'])}>
          {data.map((item) => (
            <div
              key={item.rank}
              className={classNames('top-five-list-top-five-row', styles['top-five-list-top-five-row'],
                item.rank <= 3 && 'top-five-list-top-five-row-featured',
                item.rank <= 3 && styles['top-five-list-top-five-row-featured'],
              )}
            >
              <div className={classNames('top-five-list-top-five-row-content', styles['top-five-list-top-five-row-content'])}>
                {/* 排名 */}
                <div className={classNames('top-five-list-top-five-rank', styles['top-five-list-top-five-rank'])}>{rankBadge(item.rank)}</div>

                {/* 名称 */}
                <div className={classNames('top-five-list-top-five-detail', styles['top-five-list-top-five-detail'])}>
                  <Space size={4}>
                    <Text strong className={classNames('top-five-list-top-five-name', styles['top-five-list-top-five-name'])} ellipsis>
                      {dimension === 'department' ? item.departmentName : item.userName}
                    </Text>
                    {item.rank === 1 && (
                      <Tag color="#FFD700" className={classNames('top-five-list-top-five-champion-tag', styles['top-five-list-top-five-champion-tag'])}>
                        红榜第一
                      </Tag>
                    )}
                  </Space>
                  <div className={classNames('top-five-list-top-five-meta', styles['top-five-list-top-five-meta'])}>
                    <span>
                      <Flame /> 累积提报：
                      <Text className={classNames('top-five-list-top-five-meta-value', styles['top-five-list-top-five-meta-value'])}>{item.fileCount}</Text> 件
                    </span>
                    <span className={classNames('top-five-list-top-five-meta-divider', styles['top-five-list-top-five-meta-divider'])}>|</span>
                    <span>
                      <Inbox /> 已入库：
                      <Text className={classNames('top-five-list-top-five-meta-value', styles['top-five-list-top-five-meta-value'])}>{item.approvedCount}</Text> 件
                    </span>
                  </div>
                </div>
              </div>

              {/* 分数 */}
              <div className={classNames('top-five-list-top-five-score-col', styles['top-five-list-top-five-score-col'])}>
                <Text className={classNames('top-five-list-top-five-score-main', styles['top-five-list-top-five-score-main'])}>
                  {scoreType === 'upload' ? `${item.totalScore} 个` : `${item.totalScore}`}
                  {scoreType === 'quality' && (
                    <span className={classNames('top-five-list-top-five-score-unit', styles['top-five-list-top-five-score-unit'])}>分</span>
                  )}
                </Text>
                {item.deptAvgScore != null && scoreType === 'quality' && (
                  <Tag color="orange" className={classNames('top-five-list-top-five-score-tag', styles['top-five-list-top-five-score-tag'])}>
                    部门均分：{item.deptAvgScore}
                  </Tag>
                )}
                {item.companyAvgScore != null && scoreType === 'quality' && (
                  <Tag color="blue" className={classNames('top-five-list-top-five-score-tag', styles['top-five-list-top-five-score-tag'])}>
                    公司均分：{item.companyAvgScore}
                  </Tag>
                )}
              </div>
            </div>
          ))}

          {/* 底部说明 */}
          {data.length > 0 && (
            <div className={classNames('top-five-list-top-five-note', styles['top-five-list-top-five-note'])}>
              <Text type="secondary" className={classNames('top-five-list-top-five-note-text', styles['top-five-list-top-five-note-text'])}>
                数据洗牌后即时上报总经理，锁定自然季未名次后，可依据后台数据一键转印奖励建议函。
              </Text>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default TopFiveList;
