# Common/Stat

### 概述

数据统计卡片组件，支持单个展示与列表网格布局。

### 示例

#### 示例样式

```scss
.stat-card-single-demo-wrapper {
  display: block;
}

.stat-card-single-demo-header {
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--font-color-grey);
}

.stat-card-single-demo-body {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  max-width: 1024px;
}































.stat-card-list-demo-wrapper {
  display: block;
}

.stat-card-list-demo-header {
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--font-color-grey);
}
```

#### 示例代码

- 单个卡片
- StatCard 基础展示，带前缀图标和自定义颜色
- _CommonStat(@components/Common/Stat),_Common(@components/Common),_antd(antd)

```jsx
const { StatCard } = _Common;
import { CloudUpload, FileText, User } from '@/icons';

/** StatCard 单个卡片示例 */
const StatCardSingleDemo = () => (
  <div className={'stat-card-single-demo-wrapper'}>
    {/* 基础用法 */}
    <div>
      <h4 className={'stat-card-single-demo-header'}>基础用法</h4>
      <StatCard title="总文件数" value={128} />
    </div>

    {/* 带前缀图标 */}
    <div>
      <h4 className={'stat-card-single-demo-header'}>带前缀图标</h4>
      <div className={'stat-card-single-demo-body'}>
        <StatCard title="文件数" value={128} prefix={<FileText />} />
        <StatCard title="上传量" value={56} prefix={<CloudUpload />} color="#1677ff" />
        <StatCard title="用户数" value={2048} prefix={<User />} color="#52c41a" />
      </div>
    </div>

    {/* 自定义颜色 + 点击事件 */}
    <div>
      <h4 className={'stat-card-single-demo-header'}>自定义颜色 & 可点击</h4>
      <StatCard
        title="本月新增"
        value={42}
        color="#fa8c16"
        onClick={() => alert('查看详情')}
        style={{ maxWidth: 280 }}
      />
    </div>
  </div>
);

render(<StatCardSingleDemo />);

```

- 卡片列表
- StatCardList 网格布局，自动计算列数
- _CommonStat(@components/Common/Stat),_Common(@components/Common),_antd(antd)

```jsx
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

```

### API

#### StatCardProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| title | 标题 | string (必填) |  |
| value | 数值 | number (必填) |  |
| prefix | 前缀图标 | React.ReactNode |  |
| color | 数值颜色 | string |  |
| onClick | 点击回调 | () => void |  |
| inline | 内联模式（无 Card 包裹） | boolean |  |
| fontSize | 内联模式字体大小 | number |  |

#### StatCardListProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| items | 统计项列表 | StatItem[] (必填) |  |
| gutter | 行列间距 | [number, number] |  |
| className | 容器 className | string |  |
| inline | 内联模式 | boolean |  |
| fontSize | 内联模式字体大小 | number |  |