import { ALLOWED_FILE_TYPES, FILE_TYPE_LABEL_MAP } from '@/constants';
import type { FileItem } from '@/types';
import {
  FileSpreadsheet,
  FileImage,
  FileText,
  File,
  Presentation,
  FileArchive,
  Folder,
  CirclePlay,
} from '@/icons';
import styles from './style.module.scss';
import classNames from 'classnames';

/** 根据扩展名获取文件类型名称 */
export function getFileTypeName(extension?: string): string {
  if (!extension) return '其他';
  const ext = extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`;
  for (const [typeName, exts] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (exts.includes(ext)) return FILE_TYPE_LABEL_MAP[typeName] || typeName;
  }
  return '其他';
}

/** 规范化扩展名（统一为 .xxx 小写格式） */
function normalizeExtension(extension?: string): string {
  if (!extension) return '';
  return extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`;
}

/** 根据扩展名获取对应文件图标 */
export function getFileIconByExtension(extension?: string) {
  const ext = normalizeExtension(extension);
  if (ALLOWED_FILE_TYPES.Word?.includes(ext)) return <FileText className={classNames('file-type-icon-word', styles['file-type-icon-word'])} />;
  if (ALLOWED_FILE_TYPES.PDF?.includes(ext)) return <FileText className={classNames('file-type-icon-pdf', styles['file-type-icon-pdf'])} />;
  if (ALLOWED_FILE_TYPES.Excel?.includes(ext))
    return <FileSpreadsheet className={classNames('file-type-icon-excel', styles['file-type-icon-excel'])} />;
  if (ALLOWED_FILE_TYPES.PPT?.includes(ext)) return <Presentation className={classNames('file-type-icon-ppt', styles['file-type-icon-ppt'])} />;
  if (ALLOWED_FILE_TYPES.Image?.includes(ext)) return <FileImage className={classNames('file-type-icon-image', styles['file-type-icon-image'])} />;
  if (ALLOWED_FILE_TYPES.Video?.includes(ext)) return <CirclePlay className={classNames('file-type-icon-video', styles['file-type-icon-video'])} />;
  if (ALLOWED_FILE_TYPES.Markdown?.includes(ext))
    return <FileText className={classNames('file-type-icon-markdown', styles['file-type-icon-markdown'])} />;
  if (ALLOWED_FILE_TYPES.Visio?.includes(ext)) return <File className={classNames('file-type-icon-visio', styles['file-type-icon-visio'])} />;
  if (ALLOWED_FILE_TYPES.Archive?.includes(ext))
    return <FileArchive className={classNames('file-type-icon-archive', styles['file-type-icon-archive'])} />;
  return <File className={classNames('file-type-icon-other', styles['file-type-icon-other'])} />;
}

/** 根据文件记录获取对应图标（文件夹特殊处理） */
export function getFileIcon(record: FileItem) {
  if (record.type === 'FOLDER') return <Folder className={classNames('file-type-icon-folder', styles['file-type-icon-folder'])} />;
  return getFileIconByExtension(record.extension);
}
