import { feedbackApi } from '@/api';
import type { FeedbackItem } from '@/types';
import { Modal, message } from 'antd';
import React from 'react';

interface ReopenModalProps {
  open: boolean;
  record: FeedbackItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 重新打开反馈确认弹窗 */
const ReopenModal: React.FC<ReopenModalProps> = ({ open, record, onCancel, onSuccess }) => {
  const handleOk = async () => {
    if (!record) return;
    try {
      await feedbackApi.update(record.id, { action: 'REOPEN' });
      message.success('反馈已重新打开');
      onSuccess();
    } catch {
      // handled
    }
  };

  return (
    <Modal
      title="重新打开反馈"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={400}
      destroyOnClose
    >
      <p>确定要重新打开该反馈吗？</p>
    </Modal>
  );
};

export default ReopenModal;
