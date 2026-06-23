import { MEMBER_STATUS_MAP } from '@/constants';
import { MemberStatus } from '@/types';
import { Upload as UploadIcon } from '@/icons';
import { Button, DatePicker, Form, Input, Select, Upload } from 'antd';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface StatusChangeFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

/** 状态变更表单字段 */
const StatusChangeForm: React.FC<StatusChangeFormProps> = ({ form }) => {
  const watchStatus = Form.useWatch('memberStatus', form);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="memberStatus"
        label="变更状态"
        rules={[{ required: true, message: '请选择状态' }]}
      >
        <Select
          placeholder="请选择状态"
          options={Object.entries(MEMBER_STATUS_MAP)
            .filter(([value]) => value !== MemberStatus.DELETED)
            .map(([value, { label }]) => ({
              value,
              label,
            }))}
        />
      </Form.Item>
      <Form.Item
        name="statusRemark"
        label="备注"
        rules={[{ required: true, message: '请填写备注' }]}
      >
        <Input.TextArea rows={3} placeholder="请填写状态变更备注" />
      </Form.Item>
      {watchStatus === MemberStatus.RESIGNED && (
        <>
          <Form.Item name="resignedAt" label="离职日期">
            <DatePicker className={classNames('status-change-form-link', styles['status-change-form-link'])} placeholder="选择离职日期" />
          </Form.Item>
          <Form.Item
            name="resignedAttachment"
            label="离职附件"
            valuePropName="fileList"
            getValueFromEvent={(e: unknown) => {
              if (Array.isArray(e)) return e;
              return (e as { fileList: unknown })?.fileList as unknown[];
            }}
          >
            <Upload
              action="/api/files/upload"
              maxCount={1}
              headers={{
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              }}
            >
              <Button icon={<UploadIcon />}>上传附件</Button>
            </Upload>
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default StatusChangeForm;
