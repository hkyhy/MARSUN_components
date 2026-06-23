import type { UploadTrendPoint } from '@/types';
import { formatFileSize } from '@/utils/format';
import { Area } from '@ant-design/charts';
import { Card, Segmented, Spin, theme } from 'antd';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface UploadTrendChartProps {
  data: UploadTrendPoint[];
  loading: boolean;
  trendDays: number;
  onTrendDaysChange: (days: number) => void;
  hasCustomDateRange: boolean;
}

const UploadTrendChart: React.FC<UploadTrendChartProps> = ({
  data,
  loading,
  trendDays,
  onTrendDaysChange,
  hasCustomDateRange,
}) => {
  const { token } = theme.useToken();
  const primaryColor = token.colorPrimary;

  return (
    <Card
      title="上传趋势"
      extra={
        !hasCustomDateRange ? (
          <Segmented
            value={trendDays}
            onChange={(v) => onTrendDaysChange(v as number)}
            options={[
              { label: '7天', value: 7 },
              { label: '30天', value: 30 },
              { label: '90天', value: 90 },
            ]}
            size="small"
          />
        ) : null
      }
    >
      <Spin spinning={loading}>
        {data.length > 0 ? (
          <Area
            data={data}
            xField="date"
            yField="count"
            shapeField="smooth"
            style={{
              fill: primaryColor,
              fillOpacity: 0.25,
            }}
            line={{
              style: {
                stroke: primaryColor,
                lineWidth: 2,
              },
            }}
            axis={{
              x: { labelAutoRotate: true, labelSpacing: 4 },
              y: { title: '文件数', labelSpacing: 4 },
            }}
            tooltip={{
              title: 'date',
              items: [
                { field: 'count', name: '上传数' },
                {
                  field: 'totalSize',
                  name: '总大小',
                  valueFormatter: (v: number) => formatFileSize(v),
                },
              ],
            }}
            height={300}
          />
        ) : (
          <div className={classNames('upload-trend-chart-inner', styles['upload-trend-chart-inner'])}>暂无趋势数据</div>
        )}
      </Spin>
    </Card>
  );
};

export default UploadTrendChart;
