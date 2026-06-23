import { agentHubApi } from '@/api';
import type { ChatAssistant, Dataset } from '@/types';
import { Form, message, Modal } from 'antd';
import React from 'react';
import { ChatAssistantForm } from '../Form';

export interface ChatFormModalProps {
  open: boolean;
  record?: ChatAssistant | null;
  datasets: Dataset[];
  onSuccess: () => void;
  onCancel: () => void;
}

const ChatFormModal: React.FC<ChatFormModalProps> = ({
  open,
  record,
  datasets,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const isEdit = !!record;

  React.useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        dataset_ids: record.dataset_ids ?? [],
        prologue: record.prompt_config?.prologue,
        empty_response: record.prompt_config?.empty_response,
      });
    }
    if (!open) form.resetFields();
  }, [open, record, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const payload = {
      name: values.name,
      description: values.description,
      dataset_ids: values.dataset_ids ?? [],
      prompt_config: {
        prologue: values.prologue,
        empty_response: values.empty_response,
      },
    };
    setLoading(true);
    try {
      if (isEdit && record) {
        await agentHubApi.updateChat(record.id, payload);
        message.success('助手已更新');
      } else {
        await agentHubApi.createChat(payload);
        message.success('助手已创建');
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑问答助手' : '新建问答助手'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEdit ? '保存' : '创建'}
      cancelText="取消"
      confirmLoading={loading}
      destroyOnClose
      width={560}
    >
      <ChatAssistantForm form={form} datasets={datasets} />
    </Modal>
  );
};

export default ChatFormModal;
