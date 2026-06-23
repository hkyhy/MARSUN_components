import type { FileItem as FileItemType } from '@/types';
import { getFileTypeName } from '@/utils/Files';
import { Download } from '@/icons';
import { Modal } from 'antd';
import React from 'react';
import FilePreview from '../FilePreview';
import styles from './style.module.scss';
import classNames from 'classnames';

export interface FilePreviewModalProps {
  /** 是否显示弹窗 */
  open: boolean;
  /** 文件数据 */
  file: FileItemType | null;
  /** 预览 URL 覆盖 */
  url?: string;
  /** 关闭回调 */
  onCancel: () => void;
  /** 弹窗宽度，默认 800 */
  width?: number;
}

/** 文件预览弹窗组件 */
const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  open,
  file,
  url,
  onCancel,
  width = 800,
}) => {
  if (!file) return null;

  const downloadUrl = url || `/api/files/${file.id}/download`;

  return (
    <Modal
      title={
        <div className={classNames('file-preview-modal-body', styles['file-preview-modal-body'])}>
          <span className={classNames('file-preview-modal-toolbar', styles['file-preview-modal-toolbar'])}>{file.name}</span>
          {file.extension && (
            <span className={classNames('file-preview-modal-row', styles['file-preview-modal-row'])}>
              {getFileTypeName(file.extension)}
            </span>
          )}
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={width}
      footer={null}
      destroyOnClose
    >
      <FilePreview file={file} url={url} />
      <div className={classNames('file-preview-modal-form', styles['file-preview-modal-form'])}>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={classNames('file-preview-modal-modal', styles['file-preview-modal-modal'])}
        >
          <Download />
          下载文件
        </a>
      </div>
    </Modal>
  );
};

export default FilePreviewModal;
