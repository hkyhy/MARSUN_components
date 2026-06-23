import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/constants';
import type { TreeDataNode } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

/** 允许上传的扩展名集合（来自系统可上传范畴配置） */
export const ALLOWED_EXTENSION_SET: Set<string> = new Set(Object.values(ALLOWED_FILE_TYPES).flat());

/** 已知的系统/垃圾文件名（无需上传） */
const JUNK_BASENAMES = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);

/** 从上传文件中解析相对路径（webkitRelativePath），回退为文件名 */
export function resolveRelativePath(file: UploadFile): string {
  const raw = file.originFileObj as (File & { webkitRelativePath?: string }) | undefined;
  const rel = raw?.webkitRelativePath;
  return rel && rel.length > 0 ? rel : file.name;
}

/** 取路径最后一段作为文件名 */
function basename(p: string): string {
  const segs = p.replace(/\\/g, '/').split('/').filter(Boolean);
  return segs[segs.length - 1] ?? p;
}

/** 取小写扩展名（含点），无扩展名返回空串 */
function getExtension(name: string): string {
  const idx = name.lastIndexOf('.');
  // 形如 .DS_Store 的隐藏文件不视为有扩展名
  if (idx <= 0) return '';
  return name.slice(idx).toLowerCase();
}

/** 被过滤掉的文件及原因 */
export interface FilteredFile {
  path: string;
  reason: string;
}

/** 分区结果：可上传 / 被过滤 */
export interface PartitionResult {
  valid: UploadFile[];
  filtered: FilteredFile[];
}

/**
 * 将文件夹选择的文件分为「可上传」与「被过滤」两类。
 *
 * 过滤规则：
 * - 系统/垃圾文件（.DS_Store、Thumbs.db 等）及隐藏文件（以 . 开头）
 * - 扩展名不在系统可上传范畴内
 * - 超出单文件大小上限
 */
export function partitionFolderFiles(files: UploadFile[]): PartitionResult {
  const valid: UploadFile[] = [];
  const filtered: FilteredFile[] = [];

  for (const file of files) {
    const relPath = resolveRelativePath(file);
    const name = basename(relPath);

    if (JUNK_BASENAMES.has(name) || name.startsWith('.')) {
      filtered.push({ path: relPath, reason: '系统文件' });
      continue;
    }

    const ext = getExtension(name);
    if (!ext || !ALLOWED_EXTENSION_SET.has(ext)) {
      filtered.push({ path: relPath, reason: '不支持的文件类型' });
      continue;
    }

    const size = file.size ?? (file.originFileObj as File | undefined)?.size ?? 0;
    if (size > MAX_FILE_SIZE) {
      filtered.push({ path: relPath, reason: '超出大小限制' });
      continue;
    }

    valid.push(file);
  }

  return { valid, filtered };
}

/**
 * 根据文件的相对路径构建可收起/展开的树形数据。
 *
 * 目录为父节点（key 为目录相对路径），文件为叶子节点；
 * 目录标题附带其内文件数量。
 */
export function buildTreeData(files: UploadFile[]): TreeDataNode[] {
  interface DirNode {
    name: string;
    path: string;
    dirs: Map<string, DirNode>;
    files: { name: string; path: string }[];
  }

  const root: DirNode = { name: '', path: '', dirs: new Map(), files: [] };

  for (const file of files) {
    const segs = resolveRelativePath(file).replace(/\\/g, '/').split('/').filter(Boolean);
    if (!segs.length) continue;
    const fileName = segs[segs.length - 1]!;
    const dirSegs = segs.slice(0, -1);

    let cur = root;
    let curPath = '';
    for (const seg of dirSegs) {
      curPath = curPath ? `${curPath}/${seg}` : seg;
      let next = cur.dirs.get(seg);
      if (!next) {
        next = { name: seg, path: curPath, dirs: new Map(), files: [] };
        cur.dirs.set(seg, next);
      }
      cur = next;
    }
    cur.files.push({ name: fileName, path: segs.join('/') });
  }

  const countFiles = (node: DirNode): number => {
    let total = node.files.length;
    for (const child of node.dirs.values()) total += countFiles(child);
    return total;
  };

  const toNodes = (node: DirNode): TreeDataNode[] => {
    const dirNodes: TreeDataNode[] = Array.from(node.dirs.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((dir) => ({
        title: `${dir.name}（${countFiles(dir)}）`,
        key: `dir:${dir.path}`,
        children: toNodes(dir),
      }));

    const fileNodes: TreeDataNode[] = node.files
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((f) => ({
        title: f.name,
        key: `file:${f.path}`,
        isLeaf: true,
      }));

    return [...dirNodes, ...fileNodes];
  };

  return toNodes(root);
}
