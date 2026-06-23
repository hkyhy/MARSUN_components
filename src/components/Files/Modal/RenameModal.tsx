import { RenameForm } from '@/components/Files/Form';
import { Form, Modal } from 'antd';
import React from 'react';

interface RenameModalProps {
  open: boolean;
  onOk: (name: string) => void;
  onCancel: () => void;
  defaultName?: string;
  /** 同级文件夹/文件名称列表，用于重名校验 */
  siblingNames?: string[];
}

const RenameModal: React.FC<RenameModalProps> = ({
  open,
  onOk,
  onCancel,
  defaultName,
  siblingNames,
}) => {
  const [form] = Form.useForm();

  // 当弹窗打开且 defaultName 变化时，设置表单初始值
  React.useEffect(() => {
    if (open && defaultName) {
      form.setFieldValue('name', defaultName);
    }
  }, [open, defaultName, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values.name);
      form.resetFields();
    } catch {
      // 校验失败
    }
  };

  return (
    <Modal
      title="重命名"
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      destroyOnClose
    >
      <RenameForm form={form} defaultName={defaultName} siblingNames={siblingNames} />
    </Modal>
  );
};

export default RenameModal;
