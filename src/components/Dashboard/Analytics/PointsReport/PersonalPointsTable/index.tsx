import { statsApi } from '@/api';
import type { PersonalPointsFile, PersonalPointsStat, StatsFilterParams } from '@/types';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useCallback, useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface PersonalFileScoreListProps {
  userId: string;
  filterParams: StatsFilterParams;
}

const PersonalFileScoreList: React.FC<PersonalFileScoreListProps> = ({ userId, filterParams }) => {
  const [files, setFiles] = useState<PersonalPointsFile[]>([]);
  const [loading, setLoading] = useState(true);

  const filterKey = JSON.stringify(filterParams);

  React.useEffect(() => {
    setLoading(true);
    statsApi
      .personalPointFiles(userId, filterParams)
      .then((res) => setFiles((res as unknown as { data: PersonalPointsFile[] }).data || []))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, [userId, filterKey, filterParams]);

  return (
    <Table
      rowKey="id"
      size="small"
      loading={loading}
      dataSource={files}
      pagination={false}
      columns={[
        { title: '文件名称', dataIndex: 'fileName', key: 'fileName' },
        { title: '积分', dataIndex: 'totalScore', key: 'totalScore', width: 80, align: 'right' },
        {
          title: '上传时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 180,
          render: (v: string) => v?.slice(0, 19).replace('T', ' '),
        },
      ]}
      locale={{ emptyText: '暂无文件记录' }}
    />
  );
};

interface PersonalPointsTableProps {
  data: PersonalPointsStat[];
  total: number;
  page: number;
  loading: boolean;
  filterParams: StatsFilterParams;
  onPageChange: (page: number) => void;
}

const PersonalPointsTable: React.FC<PersonalPointsTableProps> = ({
  data,
  total,
  page,
  loading,
  filterParams,
  onPageChange,
}) => {
  const expandedRowRender = useCallback(
    (record: PersonalPointsStat) => (
      <PersonalFileScoreList userId={record.userId} filterParams={filterParams} />
    ),
    [filterParams],
  );

  const columns: ColumnsType<PersonalPointsStat> = [
    { title: '部门', dataIndex: 'departmentPath', key: 'departmentPath' },
    { title: '姓名', dataIndex: 'displayName', key: 'displayName', width: 120 },
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId', width: 120 },
    {
      title: '文件数',
      dataIndex: 'fileCount',
      key: 'fileCount',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.fileCount - b.fileCount,
      render: (v: number) => <span className={classNames('text-primary', classNames('personal-points-table-wrap', styles['personal-points-table-wrap']))}>{v}</span>,
    },
    {
      title: '总积分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.totalScore - b.totalScore,
    },
  ];

  return (
    <Table
      rowKey="userId"
      columns={columns}
      dataSource={data}
      loading={loading}
      expandable={{
        expandedRowRender,
        rowExpandable: (record) => record.fileCount > 0,
      }}
      pagination={{
        current: page,
        total,
        pageSize: 20,
        showTotal: (t) => `共 ${t} 条`,
        onChange: onPageChange,
      }}
      locale={{ emptyText: '暂无个人积分数据' }}
    />
  );
};

export default PersonalPointsTable;
