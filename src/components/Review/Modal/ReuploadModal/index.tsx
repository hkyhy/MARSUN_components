import { fileApi } from '@/api';
import type { ReviewListItem } from '@/types';
import { Upload as UploadIcon } from '@/icons';
import { Button, Form, Input, message, Modal, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ReuploadModalProps {
  open: boolean;
  record: ReviewListItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const ReuploadModal: React.FC<ReuploadModalProps> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [reuploadFile, setReuploadFile] = useState<File | null>(null);
  const [reuploading, setReuploading] = useState(false);

  useEffect(() => {
    if (open && record) {
      form.setFieldValue('name', record.fileName || record.name);
    }
  }, [open, record, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!reuploadFile || !record) {
        message.warning('请选择文件');
        return;
      }
      const fileId = record.id || record.fileId;
      if (!fileId) return;
      setReuploading(true);
      try {
        const formData = new FormData();
        formData.append('file', reuploadFile);
        const originalName = record.fileName || record.name;
        if (values.name && values.name !== originalName) {
          formData.append('name', values.name);
        }
        await fileApi.reupload(fileId, formData);
        message.success('重新上传成功');
        setReuploadFile(null);
        form.resetFields();
        onSuccess();
      } catch {
        /* handled */
      } finally {
        setReuploading(false);
      }
    } catch {
      /* 校验失败 */
    }
  };

  const handleCancel = () => {
    setReuploadFile(null);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="重新上传"
      open={open}
      onCancel={handleCancel}
      confirmLoading={reuploading}
      onOk={handleOk}
      okText="确认上传"
      destroyOnClose
    >
      {record && (
        <Form form={form} layout="vertical">
          <Form.Item label="当前文件">
            <span className={classNames('reupload-modal-file-name-strong', styles['reupload-modal-file-name-strong'])}>{record.fileName || record.name}</span>
          </Form.Item>
          <Form.Item
            name="name"
            label="文件名"
            rules={[{ required: true, message: '请输入文件名' }]}
          >
            <Input placeholder="请输入文件名" />
          </Form.Item>
          <Form.Item label="选择文件" required>
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                setReuploadFile(file);
                return false;
              }}
              onRemove={() => setReuploadFile(null)}
              fileList={
                reuploadFile
                  ? [{ uid: '-1', name: reuploadFile.name, status: 'done' as const }]
                  : []
              }
            >
              <Button icon={<UploadIcon />}>选择文件</Button>
            </Upload>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ReuploadModal;
