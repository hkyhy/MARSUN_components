import { FileTags } from '@/components/Common';
import type { FileItem as FileItemType } from '@/types';
import { downloadFileItem, getFileDownloadUrl, getFileIcon, getFileTypeName } from '@/utils/Files';
import { Trash2, Download, Eye } from '@/icons';
import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import FileItemAiAssessment from '../FileItemAiAssessment';
import FilePreviewModal from '../FilePreviewModal';
import styles from './style.module.scss';
import classNames from 'classnames';

/** 文件操作项配置 */
export interface FileItemAction {
  key: string;
  icon: React.ReactNode;
  tooltip: string;
  onClick: (file: FileItemType) => void;
}

export interface FileItemProps {
  /** 文件数据 */
  file: FileItemType;
  /** 状态标签（如 ReviewStatusTag） */
  status?: React.ReactNode;
  /** 是否显示下载按钮，默认 true */
  showDownload?: boolean;
  /** 是否显示删除按钮，默认 false */
  showDelete?: boolean;
  /** 是否显示预览按钮，默认 true */
  showPreview?: boolean;
  /** 自定义操作项 */
  actions?: FileItemAction[];
  /** 下载回调 */
  onDownload?: (file: FileItemType) => void;
  /** 删除回调 */
  onDelete?: (file: FileItemType) => void;
  /** 预览回调（不传则使用内置 FilePreviewModal） */
  onPreview?: (file: FileItemType) => void;
  /** 是否在文件项内展示可折叠 AI 评估 */
  showAiAssessment?: boolean;
  /** 重新 AI 评估回调 */
  onReassess?: (fileId: string) => void;
  /** 是否正在重新评估 */
  reassessing?: boolean;
}

/** 文件项展示组件：左侧图标+文件名，右侧状态+操作 */
const FileItem: React.FC<FileItemProps> = ({
  file,
  status,
  showDownload = true,
  showDelete = false,
  showPreview = true,
  actions,
  onDownload,
  onDelete,
  onPreview,
  showAiAssessment = false,
  onReassess,
  reassessing = false,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDownload = async () => {
    if (reassessing) return;
    if (onDownload) {
      onDownload(file);
      return;
    }
    const ok = await downloadFileItem(file);
    if (!ok) {
      window.open(getFileDownloadUrl(file.id), '_blank');
    }
  };

  const handlePreview = () => {
    if (reassessing) return;
    if (onPreview) {
      onPreview(file);
    } else {
      setPreviewOpen(true);
    }
  };

  const defaultActions: FileItemAction[] = [];
  if (showPreview) {
    defaultActions.push({
      key: 'preview',
      icon: <Eye />,
      tooltip: '预览',
      onClick: () => handlePreview(),
    });
  }
  if (showDownload) {
    defaultActions.push({
      key: 'download',
      icon: <Download />,
      tooltip: '下载',
      onClick: () => handleDownload(),
    });
  }
  if (showDelete) {
    defaultActions.push({
      key: 'delete',
      icon: <Trash2 />,
      tooltip: '删除',
      onClick: () => onDelete?.(file),
    });
  }

  const allActions = [...defaultActions, ...(actions || [])];

  return (
    <>
      <div className={classNames('file-item-root', styles['file-item-root'])}>
        <div className={classNames('file-item-container', styles['file-item-container'])}>
          {/* 左侧：图标 + 文件名 + 类型 + 标签 */}
          <div className={classNames('file-item-wrapper', styles['file-item-wrapper'])}>
            <span className={classNames('file-item-inner', styles['file-item-inner'])}>{getFileIcon(file)}</span>
            <div className={classNames('file-item-header', styles['file-item-header'])}>
              <div className={classNames('file-item-body', styles['file-item-body'])}>
                <span className={classNames('file-item-footer', styles['file-item-footer'])} title={file.name}>
                  {file.name}
                </span>
                {file.extension && (
                  <span className={classNames('file-item-row', styles['file-item-row'])}>
                    {getFileTypeName(file.extension)}
                  </span>
                )}
              </div>
              {file.tags && file.tags.length > 0 && (
                <FileTags tags={file.tags} empty={null} className={classNames('file-item-col', styles['file-item-col'])} />
              )}
            </div>
          </div>

          {/* 右侧：状态 + 操作 */}
          <div className={classNames('file-item-wrap', styles['file-item-wrap'])}>
            {status && <span className={classNames('file-item-panel', styles['file-item-panel'])}>{status}</span>}
            <div
              className={classNames(
                classNames('file-item-action-group', styles['file-item-action-group']),
                reassessing && classNames('file-item-action-group-disabled', styles['file-item-action-group-disabled']),
              )}
            >
              {allActions.map((action) => (
                <Tooltip key={action.key} title={reassessing ? '评估中，请稍候' : action.tooltip}>
                  <Button
                    type="text"
                    size="small"
                    icon={action.icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (reassessing) return;
                      action.onClick(file);
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
        {showAiAssessment && (
          <FileItemAiAssessment
            assessment={file.aiAssessment}
            fileId={file.id}
            onReassess={onReassess}
            reassessing={reassessing}
          />
        )}
      </div>

      {/* 内置预览弹窗 */}
      {!onPreview && (
        <FilePreviewModal open={previewOpen} file={file} onCancel={() => setPreviewOpen(false)} />
      )}
    </>
  );
};

export default FileItem;
