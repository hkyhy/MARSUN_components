import type { DeptPointsStat } from '@/types';
import { Pie } from '@ant-design/charts';
import { Card, Spin } from 'antd';
import React, { useMemo } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ContributionPieChartProps {
  data: DeptPointsStat[];
  loading: boolean;
}

const ContributionPieChart: React.FC<ContributionPieChartProps> = ({ data, loading }) => {
  const chartData = useMemo(() => {
    const top = [...data]
      .filter((d) => d.totalScore > 0)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
    const otherScore = data
      .filter((d) => !top.find((t) => t.departmentId === d.departmentId))
      .reduce((s, d) => s + d.totalScore, 0);
    const result = top.map((d) => ({
      department: d.departmentPath.split('/').pop() || d.departmentPath,
      totalScore: d.totalScore,
    }));
    if (otherScore > 0) {
      result.push({ department: '其他', totalScore: otherScore });
    }
    return result;
  }, [data]);

  const total = chartData.reduce((s, d) => s + d.totalScore, 0);

  return (
    <Card title="部门积分贡献占比">
      <Spin spinning={loading}>
        {chartData.length > 0 ? (
          <Pie
            data={chartData}
            angleField="totalScore"
            colorField="department"
            innerRadius={0.55}
            radius={0.9}
            label={{
              text: (d: { department: string; totalScore: number }) => {
                const pct = total > 0 ? ((d.totalScore / total) * 100).toFixed(1) : '0';
                return `${d.department} ${pct}%`;
              },
              position: 'outside',
              style: { fontSize: 11 },
            }}
            tooltip={{
              items: [
                {
                  field: 'totalScore',
                  name: '积分',
                  valueFormatter: (v: number) => {
                    const pct = total > 0 ? ((v / total) * 100).toFixed(1) : '0';
                    return `${v} 分 (${pct}%)`;
                  },
                },
              ],
            }}
            height={320}
          />
        ) : (
          <div className={classNames('contribution-pie-chart-inner', styles['contribution-pie-chart-inner'])}>暂无贡献数据</div>
        )}
      </Spin>
    </Card>
  );
};

export default ContributionPieChart;
