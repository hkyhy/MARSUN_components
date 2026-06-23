const { SEMANTIC_COLORS, SemanticTag } = _Common;
import { User } from '@/icons';
import { Avatar, Card, Divider, Timeline, Typography } from 'antd';
import { CATEGORY_MAP, FEEDBACK_STATUS_CONFIG, PRIORITY_MAP } from '../config';
import { mockFeedbackDetail, mockFeedbackList } from '../mock';

const { Title, Text } = Typography;

/** 反馈列表 Demo */
const FeedbackListDemo = () => (
  <Card title="反馈工单列表" variant="borderless" className={'feedback-demo-card-shadow'}>
    <div className={'feedback-demo-list-stack'}>
      {mockFeedbackList.map((item) => (
        <div
          key={item.id}
          className={'feedback-demo-list-item'}
        >
          <Avatar size="small" icon={<User />} />
          <div className={'feedback-demo-list-item-body'}>
            <div className={'feedback-demo-list-item-title-row'}>
              <Text strong className={'feedback-demo-list-item-title'}>
                {item.title}
              </Text>
              <SemanticTag color={PRIORITY_MAP[item.priority]?.color }>
                {PRIORITY_MAP[item.priority]?.text}
              </SemanticTag>
            </div>
            <div className={'feedback-demo-list-item-meta'}>
              <span>{item.creator}</span>
              <span>{item.createdAt}</span>
              {item.assignee && <span>处理人：{item.assignee}</span>}
            </div>
          </div>
          <SemanticTag color={FEEDBACK_STATUS_CONFIG[item.status]?.color }>
            {FEEDBACK_STATUS_CONFIG[item.status]?.text}
          </SemanticTag>
        </div>
      ))}
    </div>
  </Card>
);

/** 反馈详情 Demo */
const FeedbackDetailDemo = () => (
  <Card title="反馈详情" variant="borderless" className={'feedback-demo-card-shadow'}>
    <div className={'feedback-demo-detail-stack'}>
      <div>
        <Title level={5} className={'feedback-demo-detail-title'}>
          {mockFeedbackDetail.title}
        </Title>
        <div className={'feedback-demo-list-item-title-row'}>
          <SemanticTag color={PRIORITY_MAP[mockFeedbackDetail.priority]?.color }>
            {PRIORITY_MAP[mockFeedbackDetail.priority]?.text}
          </SemanticTag>
          <SemanticTag color={FEEDBACK_STATUS_CONFIG[mockFeedbackDetail.status]?.color }>
            {FEEDBACK_STATUS_CONFIG[mockFeedbackDetail.status]?.text}
          </SemanticTag>
          <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>
            {CATEGORY_MAP[mockFeedbackDetail.category]}
          </SemanticTag>
        </div>
      </div>
      <Divider className={'feedback-demo-divider-compact'} />
      <div className={'feedback-demo-detail-grid'}>
        <div>
          <Text type="secondary">创建人：</Text>
          {mockFeedbackDetail.creator}
        </div>
        <div>
          <Text type="secondary">创建时间：</Text>
          {mockFeedbackDetail.createdAt}
        </div>
        <div>
          <Text type="secondary">处理人：</Text>
          {mockFeedbackDetail.assignee}
        </div>
        <div>
          <Text type="secondary">分类：</Text>
          {CATEGORY_MAP[mockFeedbackDetail.category]}
        </div>
      </div>
      <Divider className={'feedback-demo-divider-compact'} />
      <Timeline
        items={mockFeedbackDetail.timeline.map((t) => ({
          color: t.color,
          children: (
            <>
              <Text strong>{t.user}</Text> {t.action}{' '}
              <Text type="secondary" className={'feedback-demo-demo-time'}>
                {t.time}
              </Text>
            </>
          ),
        }))}
      />
    </div>
  </Card>
);

export { FeedbackDetailDemo, FeedbackListDemo };

const FeedbackDemo = () => (
  <div className={'feedback-demo-demo-stack'}>
    <FeedbackListDemo />
    <FeedbackDetailDemo />
  </div>
);

render(<FeedbackDemo />);
