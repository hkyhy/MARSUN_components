# Feedback

### 概述

反馈模块的筛选栏、时间线、操作按钮等业务组件。

### 示例

#### 示例样式

```scss
.feedback-demo-card-shadow {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.feedback-demo-demo-stack {
  @include flex-column(24px);
}

.feedback-demo-list-stack {
  @include flex-column(12px);
}

.feedback-demo-list-item {
  @include flex-row(12px);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--font-color-grey-4);
  transition: background-color 0.2s;

  &:hover {
    background: var(--bg-color-grey);
  }
}

.feedback-demo-list-item-body {
  flex: 1;
  min-width: 0;
}

.feedback-demo-list-item-title-row {
  @include flex-row(8px);
}

.feedback-demo-list-item-title {
  font-size: var(--font-size-default);
}

.feedback-demo-list-item-meta {
  @include flex-row(12px);
  margin-top: 4px;
  font-size: var(--font-size-small);
  color: var(--font-color-grey-1);
}

.feedback-demo-detail-stack {
  @include flex-column(16px);
}

.feedback-demo-detail-title {
  margin-bottom: 8px !important;
}

.feedback-demo-divider-compact {
  margin-top: 12px !important;
  margin-bottom: 12px !important;
}

.feedback-demo-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  font-size: var(--font-size-default);
}

.feedback-demo-demo-time {
  margin-left: 8px;
  font-size: var(--font-size-small);
}
```

#### 示例代码

- Feedback 组合
- 筛选栏 + 时间线 + 操作按钮的完整反馈流程
- _Feedback(@components/Feedback),_Common(@components/Common),_antd(antd)

```jsx
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

```

### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
