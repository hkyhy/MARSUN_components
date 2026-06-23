import type { FileItem as FileItemType } from '@/types';
import { getFileIcon, getFileTypeName } from '@/utils/Files';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

export interface FileLinkProps {
  /** 文件数据 */
  file: FileItemType;
  /** 点击回调 */
  onClick?: (file: FileItemType) => void;
}

/** 文件链接组件：以 link 样式展示文件 */
const FileLink: React.FC<FileLinkProps> = ({ file, onClick }) => {
  return (
    <a
      className={classNames('file-link-actions', styles['file-link-actions'])}
      onClick={() => onClick?.(file)}
      title={file.name}
    >
      <span className={classNames('file-link-inner', styles['file-link-inner'])}>{getFileIcon(file)}</span>
      <span className={classNames('file-link-toolbar', styles['file-link-toolbar'])}>{file.name}</span>
      {file.extension && (
        <span className={classNames('file-link-row', styles['file-link-row'])}>{getFileTypeName(file.extension)}</span>
      )}
    </a>
  );
};

export default FileLink;
