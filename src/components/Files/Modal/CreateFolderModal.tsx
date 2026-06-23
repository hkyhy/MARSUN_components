import { CreateFolderForm } from '@/components/Files/Form';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export interface CreateFolderValues {
  name: string;
  /** 非公共文件夹必选的上级文件夹 ID；公共文件夹为空 */
  parentId: string;
  /** 是否为公共文件夹（脱离部门，从根目录创建） */
  isPublic?: boolean;
}

interface CreateFolderModalProps {
  open: boolean;
  /** 默认上级文件夹（如当前浏览目录） */
  defaultParentId?: string | null;
  /** 限定可选文件夹的部门范围 */
  scopeDepartmentId?: string;
  onOk: (values: CreateFolderValues) => void;
  onCancel: () => void;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  open,
  defaultParentId,
  scopeDepartmentId,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        isPublic: false,
        // 仅在默认上级为真实文件夹时预选，根目录浏览时留空待用户选择
        parentId: defaultParentId || undefined,
      });
    }
  }, [open, defaultParentId, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const isPublic = !!values.isPublic;
      onOk({
        name: values.name,
        // 公共文件夹强制根目录
        parentId: isPublic ? '' : values.parentId,
        isPublic,
      });
      form.resetFields();
    } catch {
      // 校验失败
    }
  };

  return (
    <Modal
      title="新建文件夹"
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      destroyOnClose
    >
      <CreateFolderForm form={form} scopeDepartmentId={scopeDepartmentId} />
    </Modal>
  );
};

export default CreateFolderModal;
