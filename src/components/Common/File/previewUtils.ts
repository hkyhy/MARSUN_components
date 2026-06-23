import { ALLOWED_FILE_TYPES } from '@/constants';
import { getFileDownloadUrl } from '@/utils/Files/download';

export type PreviewType =
  | 'image'
  | 'pdf'
  | 'video'
  | 'audio'
  | 'excel'
  | 'word'
  | 'ppt'
  | 'text'
  | 'markdown'
  | 'unsupported';

const TEXT_EXTENSIONS = [
  '.txt',
  '.json',
  '.csv',
  '.log',
  '.xml',
  '.yaml',
  '.yml',
  '.ini',
  '.conf',
  '.sh',
  '.bat',
];

const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.flac', '.aac'];

/** 需要 inline + token 预览 URL 的类型（原生 media/iframe 无法带 Authorization header） */
const INLINE_PREVIEW_TYPES: PreviewType[] = ['pdf', 'video'];

/** 根据扩展名判断文件预览类型 */
export function getPreviewType(extension?: string): PreviewType {
  if (!extension) return 'unsupported';
  const ext = extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`;

  if (ALLOWED_FILE_TYPES.Image?.includes(ext)) return 'image';
  if (ALLOWED_FILE_TYPES.PDF?.includes(ext)) return 'pdf';
  if (ALLOWED_FILE_TYPES.Video?.includes(ext)) return 'video';
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  if (ALLOWED_FILE_TYPES.Excel?.includes(ext)) return 'excel';
  if (ALLOWED_FILE_TYPES.Word?.includes(ext)) return 'word';
  if (ALLOWED_FILE_TYPES.PPT?.includes(ext)) return 'ppt';
  if (ALLOWED_FILE_TYPES.Markdown?.includes(ext)) return 'markdown';
  if (TEXT_EXTENSIONS.includes(ext)) return 'text';
  return 'unsupported';
}

function appendPreviewParam(url: string): string {
  if (url.includes('preview=1')) return url;
  return url.includes('?') ? `${url}&preview=1` : `${url}?preview=1`;
}

/** 获取预览 URL */
export function resolvePreviewUrl(
  fileId: string,
  previewType: PreviewType,
  url?: string,
): string {
  if (INLINE_PREVIEW_TYPES.includes(previewType)) {
    if (url) return appendPreviewParam(url);
    return getFileDownloadUrl(fileId, { preview: true });
  }
  return url || `/api/files/${fileId}/download`;
}
