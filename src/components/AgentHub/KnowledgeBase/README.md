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
const { Space } = _antd;

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
const mockDatasets = [
  {
    id: 'kb-1',
    name: '企业制度手册',
    description: '包含考勤、休假、报销等制度文档',
    chunk_count: 1280,
    document_count: 24,
    token_num: 520000,
    embedding_model: 'BAAI/bge-m3',
    done_count: 22,
    running_count: 1,
    fail_count: 1,
    unstart_count: 0,
  },
  {
    id: 'kb-2',
    name: '产品技术文档',
    description: 'API 文档与架构设计说明',
    chunk_count: 860,
    document_count: 12,
    token_num: 310000,
    embedding_model: 'BAAI/bge-large-zh-v1.5',
    done_count: 12,
    running_count: 0,
    fail_count: 0,
    unstart_count: 0,
  },
  {
    id: 'kb-3',
    name: '客户服务 FAQ',
    description: '常见问题与标准回复话术，正在初始化',
    chunk_count: 0,
    document_count: 5,
    token_num: 0,
    embedding_model: 'text-embedding-3-small',
    done_count: 0,
    running_count: 2,
    fail_count: 0,
    unstart_count: 3,
  },
];

const mockDocuments = [
  {
    id: 'doc-1',
    name: '员工休假管理制度.pdf',
    dataset_id: 'kb-1',
    type: 'pdf',
    size: 1024 * 512,
    run: 'DONE',
    chunk_count: 48,
    create_time: '2026-05-10',
  },
  {
    id: 'doc-2',
    name: '考勤管理办法.pdf',
    dataset_id: 'kb-1',
    type: 'pdf',
    size: 1024 * 256,
    run: 'RUNNING',
    chunk_count: 0,
    create_time: '2026-06-01',
  },
  {
    id: 'doc-3',
    name: '报销流程说明.docx',
    dataset_id: 'kb-1',
    type: 'docx',
    size: 1024 * 128,
    run: 'FAIL',
    chunk_count: 0,
    create_time: '2026-06-05',
  },
  {
    id: 'doc-4',
    name: '新员工入职指南.pdf',
    dataset_id: 'kb-1',
    type: 'pdf',
    size: 1024 * 768,
    run: 'UNSTART',
    chunk_count: 0,
    create_time: '2026-06-08',
  },
];

const { default: KnowledgeCard } = _AgentHubKnowledgeBaseListKnowledgeCard;
const { message } = _antd;

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
const mockDatasets = [
  {
    id: 'kb-1',
    name: '企业制度手册',
    description: '包含考勤、休假、报销等制度文档',
    chunk_count: 1280,
    document_count: 24,
    token_num: 520000,
    embedding_model: 'BAAI/bge-m3',
    done_count: 22,
    running_count: 1,
    fail_count: 1,
    unstart_count: 0,
  },
  {
    id: 'kb-2',
    name: '产品技术文档',
    description: 'API 文档与架构设计说明',
    chunk_count: 860,
    document_count: 12,
    token_num: 310000,
    embedding_model: 'BAAI/bge-large-zh-v1.5',
    done_count: 12,
    running_count: 0,
    fail_count: 0,
    unstart_count: 0,
  },
  {
    id: 'kb-3',
    name: '客户服务 FAQ',
    description: '常见问题与标准回复话术，正在初始化',
    chunk_count: 0,
    document_count: 5,
    token_num: 0,
    embedding_model: 'text-embedding-3-small',
    done_count: 0,
    running_count: 2,
    fail_count: 0,
    unstart_count: 3,
  },
];

const mockDocuments = [
  {
    id: 'doc-1',
    name: '员工休假管理制度.pdf',
    dataset_id: 'kb-1',
    type: 'pdf',
    size: 1024 * 512,
    run: 'DONE',
    chunk_count: 48,
    create_time: '2026-05-10',
  },
  {
    id: 'doc-2',
    name: '考勤管理办法.pdf',
    dataset_id: 'kb-1',
    type: 'pdf',
    size: 1024 * 256,
    run: 'RUNNING',
    chunk_count: 0,
    create_time: '2026-06-01',
  },
  {
    id: 'doc-3',
    name: '报销流程说明.docx',
    dataset_id: 'kb-1',
    type: 'docx',
    size: 1024 * 128,
    run: 'FAIL',
    chunk_count: 0,
    create_time: '2026-06-05',
  },
  {
    id: 'doc-4',
    name: '新员工入职指南.pdf',
    dataset_id: 'kb-1',
    type: 'pdf',
    size: 1024 * 768,
    run: 'UNSTART',
    chunk_count: 0,
    create_time: '2026-06-08',
  },
];

const { default: DocumentTable } = _AgentHubKnowledgeBaseDetailDocumentTable;
const { message } = _antd;

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