const { SEMANTIC_COLORS, SemanticTag } = _Common;
const { Table } = _antd;



const MULTI_TAG_DATA = [
  {
    scene: '简历详情页',
    tags: (
      <div className={'semantic-tag-multi-demo-container'}>
        <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>已推荐</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.DANGER}>已退回</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.WARNING}>待确认</SemanticTag>
      </div>
    ),
    code: '<SemanticTag color={SEMANTIC_COLORS.SUCCESS}>已推荐</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DANGER}>已退回</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.WARNING}>待确认</SemanticTag>',
  },
  {
    scene: '文件列表状态',
    tags: (
      <div className={'semantic-tag-multi-demo-container'}>
        <SemanticTag color={SEMANTIC_COLORS.INFO}>待审核</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.PROCESSING}>审核中</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>已通过</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.DANGER}>已驳回</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>草稿</SemanticTag>
      </div>
    ),
    code: '<SemanticTag color={SEMANTIC_COLORS.INFO}>待审核</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.PROCESSING}>审核中</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>已通过</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DANGER}>已驳回</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>草稿</SemanticTag>',
  },
  {
    scene: '发票流程',
    tags: (
      <div className={'semantic-tag-multi-demo-container'}>
        <SemanticTag color={SEMANTIC_COLORS.INFO}>待提交</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.WARNING}>审核中</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>标签内容</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.DANGER}>拒绝</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>撤销审核</SemanticTag>
      </div>
    ),
    code: '<SemanticTag color={SEMANTIC_COLORS.INFO}>待提交</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.WARNING}>审核中</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>标签内容</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DANGER}>拒绝</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>撤销审核</SemanticTag>',
  },
  {
    scene: '财务状态',
    tags: (
      <div className={'semantic-tag-multi-demo-container'}>
        <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>全部</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.CYAN}>部分</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.GOLD}>亮点</SemanticTag>
        <SemanticTag color={SEMANTIC_COLORS.DANGER}>风险点</SemanticTag>
      </div>
    ),
    code: '<SemanticTag color={SEMANTIC_COLORS.SUCCESS}>全部</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.CYAN}>部分</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.GOLD}>亮点</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DANGER}>风险点</SemanticTag>',
  },
];

const multiColumns = [
  { dataIndex: 'scene', title: '场景', width: 140 },
  {
    dataIndex: 'tags',
    title: '标签组合',
    render: (_, record) => <div className={'semantic-tag-multi-demo-wrapper'}>{record.tags}</div>,
  },
];

/** 多标签组合场景展示 */
const SemanticTagMultiDemo = () => (
  <div>
    <p className={'semantic-tag-multi-demo-inner'}>多标签并列展示的常见业务场景：</p>
    <Table
      dataSource={MULTI_TAG_DATA}
      columns={multiColumns}
      pagination={false}
      size="middle"
      bordered
      rowKey={(r) => r.scene}
    />
  </div>
);

render(<SemanticTagMultiDemo />);
