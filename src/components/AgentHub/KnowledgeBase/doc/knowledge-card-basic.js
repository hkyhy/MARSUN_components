const { default: KnowledgeCard } = _AgentHubKnowledgeBaseListKnowledgeCard;
import { message } from 'antd';
import { mockDatasets } from '../mock';

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
