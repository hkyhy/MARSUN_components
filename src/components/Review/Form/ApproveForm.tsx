import { Checkbox, Form, Input } from 'antd';
import React from 'react';
import ReviewerSelect from './ReviewerSelect';

interface ApproveFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

const ApproveForm: React.FC<ApproveFormProps> = ({ form }) => {
  const needSecondReview = Form.useWatch('needSecondReview', form) as boolean | undefined;

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="needSecondReview" valuePropName="checked" initialValue={false}>
        <Checkbox>需要二级审核</Checkbox>
      </Form.Item>
      {needSecondReview && (
        <Form.Item
          name="secondReviewerId"
          label="指定二级审核人"
          rules={[{ required: true, message: '请选择二级审核人' }]}
        >
          <ReviewerSelect placeholder="请选择二级审核人" />
        </Form.Item>
      )}
      <Form.Item name="comment" label="审核意见">
        <Input.TextArea rows={3} placeholder="请输入审核意见（选填）" />
      </Form.Item>
    </Form>
  );
};

export default ApproveForm;
