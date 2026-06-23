import { settingsApi } from '@/api';
import { Trash2, Plus, Upload as UploadIcon } from '@/icons';
import { Button, Upload } from 'antd';
import React, { useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  label: string;
  previewWidth?: number;
  previewHeight?: number;
}

/** 图片上传组件：预览 + 上传 + 删除 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  previewWidth = 120,
  previewHeight = 104,
}) => {
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setLoadError(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await settingsApi.uploadImage(formData);
      const url = res?.data?.url || res?.url;
      if (url) {
        onChange?.(url);
      }
    } catch {
      // 错误已由全局拦截器提示
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleRemove = () => {
    onChange?.('');
    setLoadError(false);
  };

  if (value) {
    return (
      <div
        className={classNames('image-uploader-preview-wrapper', styles['image-uploader-preview-wrapper'])}
        style={{ width: previewWidth, height: previewHeight }}
      >
        {!loadError ? (
          <img
            src={value}
            alt={label}
            className={classNames('image-uploader-preview-image', styles['image-uploader-preview-image'])}
            onError={() => setLoadError(true)}
          />
        ) : (
          <div className={classNames('image-uploader-error-placeholder', styles['image-uploader-error-placeholder'])}>
            <span className={classNames('image-uploader-error-text', styles['image-uploader-error-text'])}>图片加载失败</span>
          </div>
        )}
        <div className={classNames('image-uploader-overlay', styles['image-uploader-overlay'])}>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
          >
            <Button size="small" type="primary" icon={<UploadIcon />} loading={uploading}>
              替换
            </Button>
          </Upload>
          <Button size="small" danger icon={<Trash2 />} onClick={handleRemove}>
            删除
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Upload
      accept="image/*"
      showUploadList={false}
      beforeUpload={(file) => {
        handleUpload(file);
        return false;
      }}
    >
      <div
        className={classNames('image-uploader-upload-trigger', styles['image-uploader-upload-trigger'])}
        style={{ width: previewWidth, height: previewHeight }}
      >
        <Plus className={classNames('image-uploader-upload-icon', styles['image-uploader-upload-icon'])} />
        <span className={classNames('image-uploader-upload-hint', styles['image-uploader-upload-hint'])}>{uploading ? '上传中...' : '上传图片'}</span>
      </div>
    </Upload>
  );
};

export default ImageUploader;
