import { ALLOWED_FILE_TYPES, FILE_TYPE_LABEL_MAP } from '@/constants';

/** 构建文件类型树形数据 */
export const FILE_TYPE_TREE_DATA = Object.entries(ALLOWED_FILE_TYPES).map(([type, exts]) => ({
  title: FILE_TYPE_LABEL_MAP[type] || type,
  value: type,
  key: type,
  children: exts.map((ext) => ({
    title: ext,
    value: ext,
    key: `${type}|${ext}`,
  })),
}));
