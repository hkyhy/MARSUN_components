/** 统计卡片 mock 数据 */
const MOCK_STAT_ITEMS = [
  { title: '总文件数', value: 128, color: '#1677ff' },
  { title: '待审核', value: 12, color: '#fa8c16' },
  { title: '已通过', value: 98, color: '#52c41a' },
  { title: '已驳回', value: 5, color: '#f5222d' },
];

/** 大数值 mock 数据 */
const MOCK_LARGE_STAT_ITEMS = [
  { title: '总存储', value: 1024, color: '#722ed1', suffix: 'GB' },
  { title: '本月上传', value: 356, color: '#13c2c2', suffix: '份' },
  { title: '活跃用户', value: 48, color: '#eb2f96', suffix: '人' },
  { title: '平均评分', value: 4.7, color: '#faad14', suffix: '分' },
];

const { StatCardList } = _Common;

/** StatCardList 列表布局示例 */
const StatCardListDemo = () => (
  <div className={'stat-card-list-demo-wrapper'}>
    {/* 基础列表 */}
    <div>
      <h4 className={'stat-card-list-demo-header'}>自动网格列表</h4>
      <StatCardList items={MOCK_STAT_ITEMS} />
    </div>

    {/* 大数值列表 */}
    <div>
      <h4 className={'stat-card-list-demo-header'}>大数值数据</h4>
      <StatCardList items={MOCK_LARGE_STAT_ITEMS} />
    </div>

    {/* 隐藏某项 */}
    <div>
      <h4 className={'stat-card-list-demo-header'}>隐藏部分项 (hidden)</h4>
      <StatCardList
        items={[
          { title: '显示项', value: 100 },
          { title: '隐藏项', value: 0, hidden: true },
          { title: '另一显示项', value: 50 },
        ]}
      />
    </div>
  </div>
);

render(<StatCardListDemo />);
