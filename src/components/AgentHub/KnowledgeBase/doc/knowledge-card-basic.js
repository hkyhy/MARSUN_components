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
        onView={(d) => message.info(`查看文档：${d.name}`)}
        onUpload={(d) => message.info(`上传文档：${d.name}`)}
        onEdit={(d) => message.info(`编辑：${d.name}`)}
        onDelete={(d) => message.success(`已删除：${d.name}`)}
      />
    ))}
  </div>
);

render(<KnowledgeCardBasicDemo />);
