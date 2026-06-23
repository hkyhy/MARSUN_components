import { formatFileSize } from '@/utils/format';
import { Crown, Star, Trophy } from '@/icons';
import { Card, Progress, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';
import type { QualityScoreItem, UploadVolumeItem } from '../types';
import styles from './style.module.scss';
import classNames from 'classnames';

// ── 常量 ──

const PODIUM_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

interface RankingDetailTableProps {
  dimension: 'department' | 'personal';
  scoreType: 'quality' | 'upload';
  uploadData: UploadVolumeItem[];
  qualityData: QualityScoreItem[];
}

/** 排名徽章 */
const rankBadge = (rank: number) => {
  if (rank === 1) return <Crown style={{ fontSize: 20, color: PODIUM_COLORS[0] }} />;
  if (rank === 2) return <Trophy style={{ fontSize: 18, color: PODIUM_COLORS[1] }}  fill="currentColor" strokeWidth={0} />;
  if (rank === 3) return <Star style={{ fontSize: 16, color: PODIUM_COLORS[2] }} />;
  return (
    <span className={classNames('ranking-detail-table-meta', styles['ranking-detail-table-meta'])}>
      {rank}
    </span>
  );
};

/** 排行详情表格组件 */
const RankingDetailTable: React.FC<RankingDetailTableProps> = ({
  dimension,
  scoreType,
  uploadData,
  qualityData,
}) => {
  const maxFileCount = React.useMemo(
    () => Math.max(...uploadData.map((d) => d.fileCount), 1),
    [uploadData],
  );
  const maxTotalScore = React.useMemo(
    () => Math.max(...qualityData.map((d) => d.totalScore), 1),
    [qualityData],
  );

  // ── 上传量表格列 ──
  const uploadColumns: ColumnsType<UploadVolumeItem> = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 64,
      align: 'center',
      render: (rank: number) => rankBadge(rank),
    },
    {
      title: dimension === 'department' ? '部门' : '姓名',
      dataIndex: dimension === 'department' ? 'departmentName' : 'userName',
      key: 'name',
      render: (_text: string, record: UploadVolumeItem) => (
        <span className={classNames('ranking-detail-table-icon', styles['ranking-detail-table-icon'])}>
          {dimension === 'department' ? record.departmentName : record.userName}
        </span>
      ),
    },
    ...(dimension === 'personal'
      ? [
          {
            title: '部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
            render: (text: string) => <span className={classNames('ranking-detail-table-title', styles['ranking-detail-table-title'])}>{text}</span>,
          },
        ]
      : []),
    {
      title: '文件数',
      dataIndex: 'fileCount',
      key: 'fileCount',
      width: 200,
      render: (value: number) => (
        <div className={classNames('ranking-detail-table-desc', styles['ranking-detail-table-desc'])}>
          <Progress
            percent={Math.round((value / maxFileCount) * 100)}
            showInfo={false}
            strokeColor={{ from: '#1677ff', to: '#36cfc9' }}
            size="small"
            className={classNames('ranking-detail-table-actions', styles['ranking-detail-table-actions'])}
          />
          <span className={classNames('ranking-detail-table-toolbar', styles['ranking-detail-table-toolbar'])}>{value}</span>
        </div>
      ),
    },
    {
      title: '总大小',
      dataIndex: 'totalSize',
      key: 'totalSize',
      align: 'right',
      render: (v: number) => <span className={classNames('ranking-detail-table-title', styles['ranking-detail-table-title'])}>{formatFileSize(v)}</span>,
    },
    ...(dimension === 'department'
      ? [
          {
            title: '活跃上传人数',
            dataIndex: 'activeUploaders',
            key: 'activeUploaders',
            align: 'right' as const,
            render: (v?: number) => <Tag color="blue">{v ?? '-'}</Tag>,
          },
        ]
      : []),
  ];

  // ── 质量排行表格列 ──
  const qualityColumns: ColumnsType<QualityScoreItem> = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 64,
      align: 'center',
      render: (rank: number) => rankBadge(rank),
    },
    {
      title: dimension === 'department' ? '部门' : '姓名',
      dataIndex: dimension === 'department' ? 'departmentName' : 'userName',
      key: 'name',
      render: (_: string, record: QualityScoreItem) => (
        <span className={classNames('ranking-detail-table-icon', styles['ranking-detail-table-icon'])}>
          {dimension === 'department' ? record.departmentName : record.userName}
        </span>
      ),
    },
    ...(dimension === 'personal'
      ? [
          {
            title: '部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
            render: (text: string) => <span className={classNames('ranking-detail-table-title', styles['ranking-detail-table-title'])}>{text}</span>,
          },
        ]
      : []),
    {
      title: '总积分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 200,
      render: (value: number) => (
        <div className={classNames('ranking-detail-table-desc', styles['ranking-detail-table-desc'])}>
          <Progress
            percent={Math.round((value / maxTotalScore) * 100)}
            showInfo={false}
            strokeColor={{ from: '#52c41a', to: '#95de64' }}
            size="small"
            className={classNames('ranking-detail-table-actions', styles['ranking-detail-table-actions'])}
          />
          <span className={classNames('ranking-detail-table-list', styles['ranking-detail-table-list'])}>{value}</span>
        </div>
      ),
    },
    {
      title: '部门均分',
      dataIndex: 'deptAvgScore',
      key: 'deptAvgScore',
      align: 'right',
      render: (v?: number) => (v != null ? <span className={classNames('ranking-detail-table-icon', styles['ranking-detail-table-icon'])}>{v}</span> : '-'),
    },
    {
      title: '公司均分',
      dataIndex: 'companyAvgScore',
      key: 'companyAvgScore',
      align: 'right',
      render: (v?: number) => (v != null ? <span className={classNames('ranking-detail-table-icon', styles['ranking-detail-table-icon'])}>{v}</span> : '-'),
    },
    {
      title: '通过文档数',
      dataIndex: 'approvedCount',
      key: 'approvedCount',
      align: 'right',
    },
    {
      title: '有效文档数',
      key: 'effectiveInfo',
      align: 'right',
      render: (_: unknown, record: QualityScoreItem) => {
        const effective = record.effectiveCount ?? record.approvedCount;
        if (record.belowLineCount && record.belowLineCount > 0) {
          return (
            <span>
              {effective}
              <Tag color="warning" className={classNames('ranking-detail-table-empty', styles['ranking-detail-table-empty'])}>
                -{record.belowLineCount}
              </Tag>
            </span>
          );
        }
        return effective;
      },
    },
    ...(dimension === 'department'
      ? [
          {
            title: '活跃上传人数',
            dataIndex: 'activeUploaders',
            key: 'activeUploaders',
            align: 'right' as const,
            render: (v?: number) => <Tag color="blue">{v ?? '-'}</Tag>,
          },
          {
            title: '人均分',
            dataIndex: 'perCapitaScore',
            key: 'perCapitaScore',
            align: 'right' as const,
            render: (v?: number) => (v != null ? <Tag color="green">{v}</Tag> : '-'),
          },
        ]
      : []),
  ];

  return (
    <Card title="排行详情" className={classNames('ranking-detail-table-loading', styles['ranking-detail-table-loading'])}>
      {scoreType === 'upload' ? (
        <Table<UploadVolumeItem>
          rowKey="rank"
          columns={uploadColumns}
          dataSource={uploadData}
          pagination={false}
          size="middle"
          locale={{ emptyText: '暂无数据' }}
        />
      ) : (
        <Table<QualityScoreItem>
          rowKey="rank"
          columns={qualityColumns}
          dataSource={qualityData}
          pagination={false}
          size="middle"
          locale={{ emptyText: '暂无数据' }}
        />
      )}
    </Card>
  );
};

export default RankingDetailTable;
