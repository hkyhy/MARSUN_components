# AgentHub/KnowledgeBase

### 概述

AgentHub 知识库模块的卡片、文档列表、解析状态标签与筛选栏等组件。

### 示例

#### 示例样式

```scss
.knowledge-card-basic-demo-desc {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 16px;
  @media (min-width: 768px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

#### 示例代码

- 解析状态标签
- ParseStatusTag 展示文档解析各阶段状态
- _AgentHubKnowledgeBase(@components/AgentHub/KnowledgeBase),_AgentHubKnowledgeBaseDetailParseStatusTag(@components/AgentHub/KnowledgeBase/Detail/ParseStatusTag),_antd(antd)

```jsx
const { default: ParseStatusTag } = _AgentHubKnowledgeBaseDetailParseStatusTag;
import { Space } from 'antd';

const ParseStatusTagBasicDemo = () => (
  <Space wrap>
    <ParseStatusTag status="UNSTART" />
    <ParseStatusTag status="RUNNING" />
    <ParseStatusTag status="DONE" />
    <ParseStatusTag status="FAIL" />
    <ParseStatusTag status="CANCEL" />
  </Space>
);

render(<ParseStatusTagBasicDemo />);

```

- 筛选栏
- KBFilterBar 按知识库名称关键词筛选
- _AgentHubKnowledgeBase(@components/AgentHub/KnowledgeBase),_AgentHubKnowledgeBaseDetailParseStatusTag(@components/AgentHub/KnowledgeBase/Detail/ParseStatusTag),_AgentHubKnowledgeBaseListFilterBar(@components/AgentHub/KnowledgeBase/List/FilterBar),_antd(antd)

```jsx
const { default: KBFilterBar } = _AgentHubKnowledgeBaseListFilterBar;

const KnowledgeBaseFilterDemo = () => {
  const [keyword, setKeyword] = React.useState('企业制度');

  return <KBFilterBar keyword={keyword} onKeywordChange={setKeyword} />;
};

render(<KnowledgeBaseFilterDemo />);

```

- 知识库卡片
- KnowledgeCard 展示文档数、分块数、解析进度与操作按钮
- _AgentHubKnowledgeBase(@components/AgentHub/KnowledgeBase),_AgentHubKnowledgeBaseDetailParseStatusTag(@components/AgentHub/KnowledgeBase/Detail/ParseStatusTag),_AgentHubKnowledgeBaseListFilterBar(@components/AgentHub/KnowledgeBase/List/FilterBar),_AgentHubKnowledgeBaseListKnowledgeCard(@components/AgentHub/KnowledgeBase/List/KnowledgeCard),_antd(antd)

```jsx
const { default: KnowledgeCard } = _AgentHubKnowledgeBaseListKnowledgeCard;
import { message } from 'antd';
import { mockDatasets } from '../mock';

const KnowledgeCardBasicDemo = () => (
  <div className={'knowledge-card-basic-demo-desc'}>
    {mockDatasets.map((dataset) => (
      <KnowledgeCard
        key={dataset.id}
        dataset={dataset}
        onView={(d) => message.info(&#96;查看文档：${d.name}&#96;)}
        onUpload={(d) => message.info(&#96;上传文档：${d.name}&#96;)}
        onEdit={(d) => message.info(&#96;编辑：${d.name}&#96;)}
        onDelete={(d) => message.success(&#96;已删除：${d.name}&#96;)}
      />
    ))}
  </div>
);

render(<KnowledgeCardBasicDemo />);

```

- 文档列表
- DocumentTable 知识库内文档管理表格，含解析/停止/删除操作
- _AgentHubKnowledgeBase(@components/AgentHub/KnowledgeBase),_AgentHubKnowledgeBaseDetailParseStatusTag(@components/AgentHub/KnowledgeBase/Detail/ParseStatusTag),_AgentHubKnowledgeBaseListFilterBar(@components/AgentHub/KnowledgeBase/List/FilterBar),_AgentHubKnowledgeBaseListKnowledgeCard(@components/AgentHub/KnowledgeBase/List/KnowledgeCard),_AgentHubKnowledgeBaseDetailDocumentTable(@components/AgentHub/KnowledgeBase/Detail/DocumentTable),_antd(antd)

```jsx
const { default: DocumentTable } = _AgentHubKnowledgeBaseDetailDocumentTable;
import { message } from 'antd';
import { mockDocuments } from './mock.js';

const DocumentTableBasicDemo = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  return (
    <DocumentTable
      datasetId="kb-1"
      data={mockDocuments}
      loading={false}
      total={mockDocuments.length}
      page={page}
      pageSize={pageSize}
      onPageChange={(p, ps) => {
        setPage(p);
        setPageSize(ps);
      }}
      onParse={(doc) => message.info(&#96;开始解析：${doc.name}&#96;)}
      onStopParse={(doc) => message.warning(&#96;停止解析：${doc.name}&#96;)}
      onDelete={(doc) => message.success(&#96;已删除：${doc.name}&#96;)}
    />
  );
};

render(<DocumentTableBasicDemo />);

```

### API

#### ParseStatusTagProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| status | 解析状态（UNSTART / RUNNING / DONE / FAIL / CANCEL） | string |  |

#### KBFilterBarProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| keyword | 搜索关键词 | string (必填) |  |
| onKeywordChange | 关键词变更回调 | (v: string) => void (必填) |  |

#### KnowledgeCardProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| dataset | 知识库对象 | Dataset (必填) |  |
| onView | 查看文档 | (dataset: Dataset) => void (必填) |  |
| onUpload | 上传文档 | (dataset: Dataset) => void (必填) |  |
| onEdit | 编辑知识库 | (dataset: Dataset) => void (必填) |  |
| onDelete | 删除知识库 | (dataset: Dataset) => void (必填) |  |

#### DocumentTableProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| datasetId | 知识库 ID | string (必填) |  |
| data | 文档列表 | KBDocument[] (必填) |  |
| loading | 加载状态 | boolean (必填) |  |
| total | 文档总数 | number (必填) |  |
| page | 当前页码 | number (必填) |  |
| pageSize | 每页条数 | number (必填) |  |
| onPageChange | 分页变更 | (page, pageSize) => void (必填) |  |
| onParse | 开始解析 | (doc: KBDocument) => void (必填) |  |
| onStopParse | 停止解析 | (doc: KBDocument) => void (必填) |  |
| onDelete | 删除文档 | (doc: KBDocument) => void (必填) |  |