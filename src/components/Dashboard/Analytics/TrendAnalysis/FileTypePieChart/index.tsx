import type { FileTypeStat } from '@/types';
import { Pie } from '@ant-design/charts';
import { Card, Segmented, Spin } from 'antd';
import React, { useMemo, useState } from 'react';
import { categorizeTypeData } from '../../utils/analyticsUtils';
import styles from './style.module.scss';
import classNames from 'classnames';

interface FileTypePieChartProps {
  data: FileTypeStat[];
  loading: boolean;
}

const FileTypePieChart: React.FC<FileTypePieChartProps> = ({ data, loading }) => {
  const [typeGroupMode, setTypeGroupMode] = useState<'raw' | 'category'>('category');

  const displayData = useMemo(
    () => (typeGroupMode === 'category' ? categorizeTypeData(data) : data),
    [data, typeGroupMode],
  );

  const total = displayData.reduce((s, d) => s + d.count, 0);

  return (
    <Card
      title="文件类型占比"
      extra={
        <Segmented
          value={typeGroupMode}
          onChange={(v) => setTypeGroupMode(v as 'raw' | 'category')}
          options={[
            { label: '按分类', value: 'category' },
            { label: '按扩展名', value: 'raw' },
          ]}
          size="small"
        />
      }
    >
      <Spin spinning={loading}>
        {displayData.length > 0 ? (
          <>
            <Pie
              data={displayData}
              angleField="count"
              colorField="extension"
              innerRadius={0.6}
              radius={0.9}
              label={{
                text: (d: FileTypeStat) => {
                  const pct = total > 0 ? ((d.count / total) * 100).toFixed(1) : '0';
                  return `${d.extension} ${pct}%`;
                },
                position: 'outside',
                style: { fontSize: 11, fill: '#666' },
              }}
              legend={{
                color: {
                  title: typeGroupMode === 'category' ? '文件分类' : '文件类型',
                  position: 'right',
                  layout: { justifyContent: 'center' },
                },
              }}
              tooltip={{
                items: [
                  {
                    field: 'count',
                    name: '文件数',
                    valueFormatter: (v: number) => {
                      const pct = total > 0 ? ((v / total) * 100).toFixed(1) : '0';
                      return `${v} 个 (${pct}%)`;
                    },
                  },
                ],
              }}
              height={300}
            />
            {displayData.some((d) => d.extension === '其他') && (
              <div className={classNames('file-type-pie-chart-panel', styles['file-type-pie-chart-panel'])}>
                「其他」包含未映射的扩展名文件
              </div>
            )}
          </>
        ) : (
          <div className={classNames('file-type-pie-chart-inner', styles['file-type-pie-chart-inner'])}>暂无类型数据</div>
        )}
      </Spin>
    </Card>
  );
};

export default FileTypePieChart;
