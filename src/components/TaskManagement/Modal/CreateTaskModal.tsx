import { handleCreateTask } from '@/components/TaskManagement/Action/handlers';
import CreateTaskForm from '@/components/TaskManagement/Form/CreateTaskForm';
import { Form, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

interface CreateTaskModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const handleOk = useCallback(async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      await handleCreateTask(values.fileId, onSuccess);
      onCancel();
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [form, onCancel, onSuccess]);

  return (
    <Modal
      title="创建 AI 评估任务"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <CreateTaskForm form={form} />
    </Modal>
  );
};

export default CreateTaskModal;
