const { StatCardList } = _Common;
import { MOCK_LARGE_STAT_ITEMS, MOCK_STAT_ITEMS } from '../mock';

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
