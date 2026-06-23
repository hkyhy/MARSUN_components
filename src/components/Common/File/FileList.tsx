import { fileHandlers } from '@/components/Files';
import type { FileItem as FileItemType } from '@/types';
import FileItem, { type FileItemAction } from './FileItem';
import FileLink from './FileLink';

/** 文件列表项配置 */
export interface FileListItem {
  /** 文件数据 */
  file: FileItemType;
  /** 展示模式：default=FileItem, link=FileLink */
  type?: 'default' | 'link';
  /** 状态标签（仅 default 模式） */
  status?: React.ReactNode;
  /** 自定义操作项（仅 default 模式） */
  actions?: FileItemAction[];
  /** 是否隐藏该项 */
  hidden?: boolean;
  /** 是否展示 AI 评估（仅 default 模式） */
  showAiAssessment?: boolean;
}

export interface FileListProps {
  /** 文件列表项 */
  items: FileListItem[];
  /** 是否显示下载按钮（default 模式），默认 true */
  showDownload?: boolean;
  /** 是否显示删除按钮（default 模式），默认 false */
  showDelete?: boolean;
  /** 是否显示预览按钮（default 模式），默认 true */
  showPreview?: boolean;
  /** 下载回调 */
  onDownload?: (file: FileItemType) => void;
  /** 删除回调 */
  onDelete?: (file: FileItemType) => void;
  /** 预览回调（仅 default 模式） */
  onPreview?: (file: FileItemType) => void;
  /** 链接点击回调（仅 link 模式） */
  onLinkClick?: (file: FileItemType) => void;
  /** 重新 AI 评估回调（仅 default 模式） */
  onReassess?: (fileId: string) => void;
  /** 正在重新评估的文件 ID */
  reassessingId?: string | null;
  /** 容器 className */
  className?: string;
}

/** 文件列表组件 */
const FileList: React.FC<FileListProps> = ({
  items,
  showDownload = true,
  showDelete = false,
  showPreview = true,
  onDownload,
  onDelete,
  onPreview,
  onLinkClick,
  onReassess,
  reassessingId,
  className,
}) => {
  if (!items.length) return null;

  return (
    <div className={className}>
      {items
        .filter((item) => !item.hidden)
        .map((item) => {
          const key = item.file.id;
          if (item.type === 'link') {
            return <FileLink key={key} file={item.file} onClick={onLinkClick} />;
          }
          return (
            <FileItem
              key={key}
              file={item.file}
              status={item.status}
              actions={item.actions}
              showDownload={showDownload}
              showDelete={showDelete}
              showPreview={showPreview}
              showAiAssessment={item.showAiAssessment}
              onReassess={onReassess}
              reassessing={reassessingId === item.file.id}
              onDownload={onDownload || ((file) => fileHandlers.handleDownloadFile(file))}
              onDelete={onDelete}
              onPreview={onPreview}
            />
          );
        })}
    </div>
  );
};

export default FileList;
