import { agentHubApi } from '@/api';
import type { Dataset } from '@/types';
import { Form, message, Modal } from 'antd';
import React from 'react';
import { KnowledgeBaseForm } from '../Form';

export interface KBFormModalProps {
  open: boolean;
  record?: Dataset | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const KBFormModal: React.FC<KBFormModalProps> = ({ open, record, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const isEdit = !!record;

  React.useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        embedding_model: record.embedding_model,
        chunk_method: record.chunk_method,
      });
    }
    if (!open) {
      form.resetFields();
    }
  }, [open, record, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      if (isEdit && record) {
        await agentHubApi.updateDataset(record.id, values);
        message.success('知识库已更新');
      } else {
        await agentHubApi.createDataset(values);
        message.success('知识库已创建');
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑知识库' : '新建知识库'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEdit ? '保存' : '创建'}
      cancelText="取消"
      confirmLoading={loading}
      destroyOnClose
      width={520}
    >
      <KnowledgeBaseForm form={form} />
    </Modal>
  );
};

export default KBFormModal;
