import { userApi } from '@/api';
import { StatusChangeForm } from '@/components/System/Users/Form';
import type { UserInfo } from '@/types';
import { MemberStatus } from '@/types';
import { Form, message, Modal } from 'antd';
import React, { useEffect } from 'react';

interface StatusChangeModalProps {
  open: boolean;
  user: UserInfo | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 成员状态变更弹窗 */
const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  open,
  user,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && user) {
      form.resetFields();
      form.setFieldsValue({ memberStatus: user.memberStatus });
    }
  }, [open, user, form]);

  const handleOk = async () => {
    if (!user) return;
    try {
      const values = await form.validateFields();
      const payload: {
        memberStatus: string;
        statusRemark?: string;
        resignedAt?: string;
        resignedAttachment?: string;
      } = {
        memberStatus: values.memberStatus,
        statusRemark: values.statusRemark,
      };
      if (values.memberStatus === MemberStatus.RESIGNED) {
        payload.resignedAt =
          values.resignedAt?.format('YYYY-MM-DD') || new Date().toISOString().split('T')[0];
        payload.resignedAttachment =
          values.resignedAttachment?.[0]?.response?.data?.url ||
          values.resignedAttachment?.[0]?.url;
      }
      await userApi.updateStatus(user.id, payload);
      message.success('状态变更成功');
      form.resetFields();
      onSuccess();
    } catch {
      /* validation */
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`变更状态 - ${user?.displayName || ''}`}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={520}
      destroyOnClose
    >
      <StatusChangeForm form={form} />
    </Modal>
  );
};

export default StatusChangeModal;
