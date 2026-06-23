const { ReviewStatusTag } = _Common;
import { CircleCheck, Send, ArrowLeftRight } from '@/icons';
import ButtonGroup from '@kne/button-group';
import { Card, Steps, Table, Timeline, Typography } from 'antd';
import { mockReviewList, mockReviewSteps, mockReviewTimeline } from '../mock';

const { Title, Text } = Typography;

/** 审核列表 Demo */
const ReviewListDemo = () => {
  const columns = [
    { title: '文件名', dataIndex: 'fileName', key: 'fileName' },
    { title: '提报人', dataIndex: 'uploader', key: 'uploader' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <ReviewStatusTag status={v} />,
    },
    { title: '提报日期', dataIndex: 'date', key: 'date' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: (typeof mockReviewList)[0]) => {
        const listArray: Record<string, unknown>[] = [
          {
            type: 'link',
            children: '审核',
            onClick: () => console.log('审核', record),
            hidden: record.status !== 'PENDING_REVIEWER',
          },
          {
            type: 'link',
            children: '通过',
            onClick: () => console.log('通过', record),
            hidden: record.status !== 'REVIEWING_REVIEWER',
          },
          {
            type: 'link',
            children: '驳回',
            danger: true,
            isDelete: false,
            message: `确定驳回「${record.fileName}」吗？`,
            onClick: () => console.log('驳回', record),
            hidden: record.status !== 'REVIEWING_REVIEWER',
          },
        ];
        return <ButtonGroup moreType="link" list={listArray} />;
      },
    },
  ];

  return (
    <Card title="待审核文件" variant="borderless" className={'review-demo-card-shadow'}>
      <Table dataSource={mockReviewList} columns={columns} size="small" pagination={false} />
    </Card>
  );
};

/** 审核流程 Demo */
const ReviewFlowDemo = () => (
  <Card title="审核流程" variant="borderless" className={'review-demo-card-shadow'}>
    <Steps
      direction="vertical"
      size="small"
      current={2}
      items={mockReviewSteps.map((step, i) => ({
        title: step.title,
        description: step.description,
        icon: i === 0 ? <Send /> : i === 1 ? <ArrowLeftRight /> : <CircleCheck />,
      }))}
    />
    <div className={'review-demo-demo-section'}>
      <Title level={5} className={'review-demo-demo-title'}>
        审核记录
      </Title>
      <Timeline
        items={mockReviewTimeline.map((t) => ({
          color: t.color,
          children: (
            <>
              <Text strong>{t.user}</Text> {t.action}{' '}
              <Text type="secondary" className={'review-demo-demo-time'}>
                {t.time}
              </Text>
            </>
          ),
        }))}
      />
    </div>
  </Card>
);

export { ReviewFlowDemo, ReviewListDemo };

const ReviewDemo = () => (
  <div className={'review-demo-demo-stack'}>
    <ReviewListDemo />
    <ReviewFlowDemo />
  </div>
);

render(<ReviewDemo />);
