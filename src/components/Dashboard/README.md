# Dashboard

### 概述

数据看板相关组件，包括资产贡献榜等。

### 示例

#### 示例样式

```scss
.asset-board-demo-root {
  background-color: #1a1625;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  overflow: hidden;
}

.asset-board-demo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.asset-board-demo-wrapper {
  color: var(--warning-color);
  font-size: var(--font-size-large);
}

.asset-board-demo-inner {
  color: var(--warning-color);
  font-weight: 700;
  white-space: nowrap;
}

.asset-board-demo-header {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.asset-board-demo-body {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--font-size-small);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: broadcastFadeIn 0.3s ease;
}

.asset-board-demo-footer {
  color: rgba(255, 255, 255, 0.5);
}

.asset-board-demo-row {
  color: var(--info-color);
  font-weight: 500;
}

.asset-board-demo-col {
  color: var(--tag-info);
  font-weight: 500;
}

.asset-board-demo-wrap {
  flex-shrink: 0;
}

.asset-board-demo-panel {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  margin-left: 8px;
}

.asset-board-demo-cell {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.asset-board-demo-main {
  font-size: var(--font-size-small);
  color: var(--font-color-grey-1);
}

.asset-board-demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.asset-board-demo-cell-active {
  width: 16px;
  background-color: var(--warning-color);
}

.asset-board-demo-cell-inactive {
  /* default cell appearance from .asset-board-demo-cell */
}

.asset-board-demo-leaderboard-card {
  box-shadow: none;
}

.asset-board-demo-leaderboard-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.asset-board-demo-leaderboard-icon {
  color: var(--warning-color);
}

.asset-board-demo-leaderboard-title {
  margin-bottom: 0 !important;
}

.asset-board-demo-leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.asset-board-demo-leaderboard-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
}

.asset-board-demo-leaderboard-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 9999px;
  background-color: var(--primary-color-bg);
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 600;
}

.asset-board-demo-leaderboard-dept {
  flex: 1;
  min-width: 0;
}

.asset-board-demo-leaderboard-count {
  color: var(--font-color-grey);
  font-size: 12px;
}

.asset-board-demo-leaderboard-score {
  color: var(--primary-color);
  font-weight: 600;
}

.asset-board-demo-page {
  display: block;
}

.asset-board-demo-header-list {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-board-demo-header-icon {
  color: var(--warning-color);
}

.asset-board-demo-page-title {
  margin-bottom: 0 !important;
}

.asset-board-demo-rules-card {
  height: 100%;
}

.asset-board-demo-rules-title {
  margin-bottom: 12px !important;
}
```

#### 示例代码

- 资产贡献榜
- AssetContributionBoard 数据可视化面板
- _Dashboard(@components/Dashboard),_Common(@components/Common),_antd(antd)

```jsx
const { SEMANTIC_COLORS, SemanticTag } = _Common;
import { Send, Trophy } from '@/icons';
import ButtonGroup from '@kne/button-group';
import { Card, Col, Row, Typography } from 'antd';
import { BROADCAST_INTERVAL, SCORE_RULES } from '../config';
import { mockBroadcastList, mockLeaderboard } from '../mock';

const { Title } = Typography;

/** 实时播报 Demo */
const BroadcastDemo = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockBroadcastList.length);
    }, BROADCAST_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const current: any = mockBroadcastList[currentIndex];

  return (
    <div className={'asset-board-demo-root'}>
      <div className={'asset-board-demo-container'}>
        <Send className={'asset-board-demo-wrapper'} />
        <span className={'asset-board-demo-inner'}>【实时投递动态播报】</span>
      </div>
      <div className={'asset-board-demo-header'}>
        <div key={current.id} className={'asset-board-demo-body'}>
          <span className={'asset-board-demo-footer'}>→ </span>
          {current.departmentName}{' '}
          <span className={'asset-board-demo-row'}>{current.uploaderName}</span> 提报了：
          <span className={'asset-board-demo-col'}>《{current.fileName}》</span>
        </div>
      </div>
      <SemanticTag
        color={
          current.reviewStatus?.includes('PENDING')
            ? SEMANTIC_COLORS.PROCESSING
            : current.reviewStatus?.includes('REVIEWING')
              ? SEMANTIC_COLORS.INFO
              : current.reviewStatus === 'APPROVED'
                ? SEMANTIC_COLORS.SUCCESS
                : SEMANTIC_COLORS.DEFAULT
        }
        className={'asset-board-demo-wrap'}
      >
        流程中
      </SemanticTag>
      <div className={'asset-board-demo-panel'}>
        {mockBroadcastList.map((_, i) => (
          <span
            key={i}
            className={classNames(
              'asset-board-demo-cell',
              'asset-board-demo-cell',
              i === currentIndex
                ? 'asset-board-demo-cell-active'
                : 'asset-board-demo-cell-inactive',
            )}
          />
        ))}
      </div>
    </div>
  );
};

/** Top5 排行 Demo */
const LeaderboardDemo = () => (
  <Card variant="borderless" className={'asset-board-demo-leaderboard-card'}>
    <div className={'asset-board-demo-leaderboard-header'}>
      <Trophy className={'asset-board-demo-leaderboard-icon'} />
      <Title level={5} className={'asset-board-demo-leaderboard-title'}>
        部门排行 Top5
      </Title>
    </div>
    <div className={'asset-board-demo-leaderboard-list'}>
      {mockLeaderboard.map((item) => (
        <div key={item.rank} className={'asset-board-demo-leaderboard-row'}>
          <span className={'asset-board-demo-leaderboard-rank'}>
            {item.rank}
          </span>
          <span className={'asset-board-demo-leaderboard-dept'}>
            {item.departmentName}
          </span>
          <span className={'asset-board-demo-leaderboard-count'}>
            {item.fileCount} 文件
          </span>
          <span className={'asset-board-demo-leaderboard-score'}>
            {item.totalScore} 分
          </span>
        </div>
      ))}
    </div>
  </Card>
);

/** 资产贡献榜完整 Demo */
const AssetBoardDemo = () => {
  const headerListArray: Record<string, unknown>[] = [
    {
      type: 'primary',
      children: '一键提报',
      icon: <Send />,
      onClick: () => console.log('一键提报'),
    },
  ];

  return (
    <div className={'asset-board-demo-page'}>
      <Card variant="borderless" className="shadow-none">
        <div className={'asset-board-demo-toolbar'}>
          <div className={'asset-board-demo-header-list'}>
            <Trophy className={'asset-board-demo-header-icon'} />
            <Title level={3} className={'asset-board-demo-page-title'}>
              资产贡献榜
            </Title>
          </div>
          <ButtonGroup list={headerListArray} />
        </div>
      </Card>
      <BroadcastDemo />
      <Row gutter={[16, 0]}>
        <Col xs={24} lg={15}>
          <LeaderboardDemo />
        </Col>
        <Col xs={24} lg={9}>
          <Card variant="borderless" className={'asset-board-demo-rules-card'}>
            <Title level={5} className={'asset-board-demo-rules-title'}>
              积分规则说明
            </Title>
            <ul className={'asset-board-demo-main'}>
              {SCORE_RULES.map((rule) => (
                <li key={rule.label}>
                  {rule.label} {rule.score}
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export { BroadcastDemo, LeaderboardDemo };
render(<AssetBoardDemo />);

```

### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
