import { CircleCheck, CircleX } from '@/icons';
import { Button, Form, Input, Space } from 'antd';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ReviewFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  loading?: boolean;
  onAction: (action: 'APPROVE' | 'REJECT' | 'RETURN') => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ form, loading, onAction }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item name="comment" label="审核意见">
        <Input.TextArea rows={3} placeholder="请输入审核意见" />
      </Form.Item>
      <Form.Item name="reason" label="驳回/退回原因">
        <Input.TextArea rows={2} placeholder="驳回或退回时必填" />
      </Form.Item>
      <Form.Item className={classNames('review-form-form-actions', styles['review-form-form-actions'])}>
        <Space>
          <Button
            onClick={() => onAction('RETURN')}
            icon={<CircleX />}
            loading={loading}
          >
            退回修改
          </Button>
          <Button
            danger
            onClick={() => onAction('REJECT')}
            icon={<CircleX />}
            loading={loading}
          >
            驳回
          </Button>
          <Button
            type="primary"
            onClick={() => onAction('APPROVE')}
            icon={<CircleCheck />}
            loading={loading}
          >
            通过
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm;
