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
