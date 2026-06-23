import type { DeptPointsStat } from '@/types';
import { Progress, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import { buildDeptPointsTree } from '../../utils/analyticsUtils';
import styles from './style.module.scss';
import classNames from 'classnames';

interface DeptPointsTableProps {
  data: DeptPointsStat[];
  loading: boolean;
}

const DeptPointsTable: React.FC<DeptPointsTableProps> = ({ data, loading }) => {
  const treeData = useMemo(() => buildDeptPointsTree(data), [data]);
  const allKeys = useMemo(() => data.map((d) => d.departmentId), [data]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (allKeys.length > 0) setExpandedKeys(allKeys);
  }, [allKeys]);

  const maxScore = Math.max(...data.map((d) => d.totalScore), 1);

  const columns: ColumnsType<DeptPointsStat> = [
    {
      title: '部门',
      dataIndex: 'departmentPath',
      key: 'departmentPath',
      render: (path: string) => <span className={classNames('dept-points-table-header', styles['dept-points-table-header'])}>{path}</span>,
    },
    {
      title: '成员数',
      dataIndex: 'memberCount',
      key: 'memberCount',
      align: 'right',
      width: 100,
      sorter: (a, b) => a.memberCount - b.memberCount,
    },
    {
      title: '文件数',
      dataIndex: 'fileCount',
      key: 'fileCount',
      width: 180,
      sorter: (a, b) => a.fileCount - b.fileCount,
      render: (value: number) => (
        <div className={classNames('dept-points-table-body', styles['dept-points-table-body'])}>
          <Progress
            percent={Math.round((value / Math.max(...data.map((d) => d.fileCount), 1)) * 100)}
            showInfo={false}
            size="small"
            className={classNames('dept-points-table-footer', styles['dept-points-table-footer'])}
          />
          <span className={classNames('dept-points-table-row', styles['dept-points-table-row'])}>{value}</span>
        </div>
      ),
    },
    {
      title: '总积分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 180,
      sorter: (a, b) => a.totalScore - b.totalScore,
      render: (value: number) => (
        <div className={classNames('dept-points-table-body', styles['dept-points-table-body'])}>
          <Progress
            percent={Math.round((value / maxScore) * 100)}
            showInfo={false}
            strokeColor="#722ed1"
            size="small"
            className={classNames('dept-points-table-footer', styles['dept-points-table-footer'])}
          />
          <span className={classNames('dept-points-table-col', styles['dept-points-table-col'])}>{value}</span>
        </div>
      ),
    },
  ];

  return (
    <Table
      rowKey="departmentId"
      columns={columns}
      dataSource={treeData}
      loading={loading}
      pagination={false}
      locale={{ emptyText: '暂无部门积分数据' }}
      expandable={{
        expandedRowKeys: expandedKeys,
        onExpandedRowsChange: (keys) => setExpandedKeys(keys as string[]),
      }}
    />
  );
};

export default DeptPointsTable;
