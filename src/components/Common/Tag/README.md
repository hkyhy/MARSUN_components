# Common/Tag

### 概述

统一颜色体系的语义化标签，适用于状态标识、分类标记等场景。

### 示例

#### 示例样式

```scss
.semantic-tag-basic-demo-root {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}











































.semantic-tag-review-demo-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.semantic-tag-review-demo-header {
  color: var(--font-color-grey-1);
}

.semantic-tag-review-demo-body {
  display: block;
}

.semantic-tag-review-demo-footer {
  margin-bottom: 12px;
  font-size: var(--font-size-small);
  color: var(--font-color-grey);
}







































.semantic-tag-multi-demo-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.semantic-tag-multi-demo-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.semantic-tag-multi-demo-inner {
  margin-bottom: 16px;
  font-size: var(--font-size-small);
  color: var(--font-color-grey);
}
```

#### 示例代码

- 基本用法
- 所有预定义语义颜色的展示
- _CommonTag(@components/Common/Tag),_Common(@components/Common),_antd(antd)

```jsx
const { SEMANTIC_COLORS, SemanticTag } = _Common;

/** 基础用法：展示所有预定义语义颜色 */
const SemanticTagBasicDemo = () => (
  <div className={'semantic-tag-basic-demo-root'}>
    <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>Default 默认</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.INFO}>Info 信息</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.PROCESSING}>Processing 进行中</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>Success 成功</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.WARNING}>Warning 警告</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.DANGER}>Danger 危险</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.OTHER}>Other 其他</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.VOLCANO}>Volcano 火山</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.CYAN}>Cyan 青色</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.GOLD}>Gold 金色</SemanticTag>
    <SemanticTag color={SEMANTIC_COLORS.LIME}>Lime 石灰</SemanticTag>
  </div>
);

render(<SemanticTagBasicDemo />);

```

- 审核状态场景
- 在列表页 Table、简历详情页等场景下的状态标签使用
- _CommonTag(@components/Common/Tag),_Common(@components/Common),_antd(antd)

```jsx
const { SEMANTIC_COLORS, SemanticTag } = _Common;
import { Table } from 'antd';


/** 标签行数据 */
interface TagRowData {
  scenario: string;
  label: string;
  status: string;
  tagElement;
  code: string;
}

/** 审核状态场景 — 参考 antd 文档图片风格 */
const REVIEW_ROWS = [
  {
    scenario: '使用规则',
    label: '待XX，暂停',
    status: '示例',
    tagElement: <SemanticTag color={SEMANTIC_COLORS.INFO}>待提交</SemanticTag>,
    code: '<SemanticTag color={SEMANTIC_COLORS.INFO}>待提交</SemanticTag>',
  },
  {
    scenario: '使用规则',
    label: 'XX中，正在XX中',
    status: '示例',
    tagElement: <SemanticTag color={SEMANTIC_COLORS.WARNING}>审核中</SemanticTag>,
    code: '<SemanticTag color={SEMANTIC_COLORS.WARNING}>审核中</SemanticTag>',
  },
  {
    scenario: '使用规则',
    label: '通过，成功，完成',
    status: '示例',
    tagElement: <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>标签内容</SemanticTag>,
    code: '<SemanticTag color={SEMANTIC_COLORS.SUCCESS}>标签内容</SemanticTag>',
  },
  {
    scenario: '使用规则',
    label: '不通过，失败，淘汰，缺席，拒绝',
    status: '示例',
    tagElement: <SemanticTag color={SEMANTIC_COLORS.DANGER}>已拒绝</SemanticTag>,
    code: '<SemanticTag color={SEMANTIC_COLORS.DANGER}>已拒绝</SemanticTag>',
  },
  {
    scenario: '使用规则',
    label: '取消，撤销，停止',
    status: '示例',
    tagElement: <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>撤销审核</SemanticTag>,
    code: '<SemanticTag color={SEMANTIC_COLORS.DEFAULT}>撤销审核</SemanticTag>',
  },
  {
    scenario: '使用规则',
    label: '(暂时还未用到)',
    status: '示例',
    tagElement: <SemanticTag color={SEMANTIC_COLORS.OTHER}>标签内容</SemanticTag>,
    code: '<SemanticTag color={SEMANTIC_COLORS.INFO}>标签内容</SemanticTag>',
  },
];

/** 多标签组合场景 */
const MULTI_ROWS = [
  {
    scenario: '使用规则',
    label: '待XX，暂停',
    status: '示例',
    tagElement: (
      <>
        <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>已推荐</SemanticTag>{' '}
        <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>已退票</SemanticTag>
      </>
    ),
    code: '<SemanticTag color={SEMANTIC_COLORS.SUCCESS}>已推荐</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>已退票</SemanticTag>',
  },
  {
    scenario: '使用规则',
    label: '已XX待XX',
    status: '示例',
    tagElement: (
      <>
        <SemanticTag color={SEMANTIC_COLORS.CYAN}>已开票待寄出</SemanticTag>{' '}
        <SemanticTag color={SEMANTIC_COLORS.WARNING}>已等待收款</SemanticTag>
      </>
    ),
    code: '<SemanticTag color={SEMANTIC_COLORS.CYAN}>已开票待寄出</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.WARNING}>已等待收款</SemanticTag>',
  },
  {
    scenario: '使用规则',
    label: '已XX+词语：根据后面的词语语义进行判断',
    status: '示例',
    tagElement: (
      <>
        <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>已成功</SemanticTag>{' '}
        <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>已取消</SemanticTag>{' '}
        <SemanticTag color={SEMANTIC_COLORS.DANGER}>已失败</SemanticTag>{' '}
        <SemanticTag color={SEMANTIC_COLORS.WARNING}>已暂停</SemanticTag>
      </>
    ),
    code: '<SemanticTag color={SEMANTIC_COLORS.SUCCESS}>已成功</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>已取消</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DANGER}>已失败</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.WARNING}>已暂停</SemanticTag>',
  },
  {
    scenario: '使用规则',
    label: '完全根据语义语境判断',
    status: '示例',
    tagElement: (
      <>
        <SemanticTag color={SEMANTIC_COLORS.SUCCESS}>全部</SemanticTag>{' '}
        <SemanticTag color={SEMANTIC_COLORS.CYAN}>部分</SemanticTag>{' '}
        <SemanticTag color={SEMANTIC_COLORS.GOLD}>亮点</SemanticTag>{' '}
        <SemanticTag color={SEMANTIC_COLORS.DANGER}>风险点</SemanticTag>
      </>
    ),
    code: '<SemanticTag color={SEMANTIC_COLORS.SUCCESS}>全部</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.CYAN}>部分</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.GOLD}>亮点</SemanticTag> <SemanticTag color={SEMANTIC_COLORS.DANGER}>风险点</SemanticTag>',
  },
];

const columns = [
  { dataIndex: 'scenario', title: '', width: 100 },
  { dataIndex: 'label', title: '', width: 300, render: (text) => <span>{text}</span> },
  {
    dataIndex: 'status',
    title: '',
    width: 80,
    render: (text) => <span className={'semantic-tag-review-demo-header'}>{text}</span>,
  },
  {
    dataIndex: 'tagElement',
    title: '',
    render: (_, record) => <div className={'semantic-tag-review-demo-wrapper'}>{record.tagElement}</div>,
  },
];

/** 审核状态场景：Table 展示 */
const SemanticTagReviewDemo = () => (
  <div className={'semantic-tag-review-demo-body'}>
    <div>
      <p className={'semantic-tag-review-demo-footer'}>使用场景：列表页 Table、简历详情页</p>
      <Table
        dataSource={REVIEW_ROWS}
        columns={columns}
        pagination={false}
        size="middle"
        bordered
        rowKey={(_, i) => String(i)}
      />
    </div>

    <div>
      <p className={'semantic-tag-review-demo-footer'}>个别特殊场景（需要单独询问 UI）：</p>
      <Table
        dataSource={MULTI_ROWS}
        columns={columns}
        pagination={false}
        size="middle"
        bordered
        rowKey={(_, i) => &#96;multi-${i}&#96;}
      />
    </div>
  </div>
);

render(<SemanticTagReviewDemo />);

```

- 多标签组合场景
- 多个标签并列展示，如已推荐简历+已退票等多状态并存
- _CommonTag(@components/Common/Tag),_Common(@components/Common),_antd(antd)

```jsx
const { SEMANTIC_COLORS, SemanticTag } = _Common;
import { Table } from 'antd';


interface MultiTagRow {
  scene: string;
  tags;
  code: string;
}

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

```

### API

#### SemanticTagProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| children | 标签文本 | React.ReactNode (必填) |  |
| color | 语义化颜色（推荐使用 SEMANTIC_COLORS） | SemanticColor | string | 'default' |
| ...Tag props | 继承 antd Tag 其余属性 | TagProps |  |

#### SEMANTIC_COLORS

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| DEFAULT | 默认/中性 | 'default' |  |
| INFO | 信息/提示 | 'blue' |  |
| PROCESSING | 进行中/处理中 | 'processing' |  |
| SUCCESS | 成功/已完成 | 'green' |  |
| WARNING | 警告/待处理 | 'orange' |  |
| DANGER | 危险/紧急 | 'red' |  |
| SPECIAL | 特殊/待复查 | 'purple' |  |
| VOLCANO | 火山/领导审批 | 'volcano' |  |
| CYAN | 青色/辅助 | 'cyan' |  |
| GOLD | 金色/高优先级 | 'gold' |  |
| LIME | 石灰/低优先级 | 'lime' |  |