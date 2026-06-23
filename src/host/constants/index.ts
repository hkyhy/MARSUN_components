import { SEMANTIC_COLORS } from '@/components/Common/Tag/SemanticTag';
import { ReviewStatus } from '@/types';

/** 文件类型白名单 */
export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  Word: ['.doc', '.docx'],
  PDF: ['.pdf'],
  Excel: ['.xls', '.xlsx', '.csv'],
  PPT: ['.ppt', '.pptx'],
  Image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'],
  Video: ['.mp4', '.webm', '.mov'],
  Markdown: ['.md', '.markdown'],
  Visio: ['.vsdx', '.vsd'],
  Archive: ['.zip', '.rar', '.7z'],
};

/** 文件类型中文映射 */
export const FILE_TYPE_LABEL_MAP: Record<string, string> = {
  Word: 'Word文档',
  PDF: 'PDF文档',
  Excel: 'Excel表格',
  PPT: 'PPT演示',
  Image: '图片',
  Video: '视频',
  Markdown: 'Markdown文档',
  Visio: 'Visio绘图',
  Archive: '压缩包',
};

/** MIME类型映射 */
export const MIME_MAP: Record<string, string[]> = {
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/pdf': ['.pdf'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/csv': ['.csv'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/bmp': ['.bmp'],
  'image/svg+xml': ['.svg'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/quicktime': ['.mov'],
  'text/markdown': ['.md', '.markdown'],
  'text/x-markdown': ['.md', '.markdown'],
  'application/vnd.ms-visio': ['.vsd'],
  'application/vnd.visio': ['.vsdx'],
};

/** 单文件大小上限（字节），默认500MB */
export const MAX_FILE_SIZE = 500 * 1024 * 1024;

/** 单文件大小上限显示 */
export const MAX_FILE_SIZE_DISPLAY = '500MB';

/** 侧边栏菜单配置 */
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path: string;
  roles?: string[];
  children?: MenuItem[];
}

/** 审核状态标签映射（唯一数据源） */
export const REVIEW_STATUS_LABEL_MAP: Record<ReviewStatus, string> = {
  [ReviewStatus.DRAFT]: '待提交',
  [ReviewStatus.PENDING_REVIEWER]: '待审核员审核',
  [ReviewStatus.REVIEWING_REVIEWER]: '审核员正在审核',
  [ReviewStatus.PENDING_SECOND_REVIEWER]: '待二级审核',
  [ReviewStatus.REVIEWING_SECOND_REVIEWER]: '二级审核中',
  [ReviewStatus.APPROVED]: '审核已通过',
  [ReviewStatus.REJECTED]: '已驳回',
  [ReviewStatus.RETURNED]: '退回修改',
  [ReviewStatus.REVOKED]: '已撤销',
  [ReviewStatus.ARCHIVED]: '已归档',
};

/** 审核状态颜色映射 */
export const REVIEW_STATUS_MAP: Record<string, { label: string; color: string }> = {
  DRAFT: { label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.DRAFT], color: SEMANTIC_COLORS.DEFAULT },
  PENDING_REVIEWER: {
    label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.PENDING_REVIEWER],
    color: SEMANTIC_COLORS.WARNING,
  },
  REVIEWING_REVIEWER: {
    label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.REVIEWING_REVIEWER],
    color: SEMANTIC_COLORS.PROCESSING,
  },
  PENDING_SECOND_REVIEWER: {
    label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.PENDING_SECOND_REVIEWER],
    color: SEMANTIC_COLORS.VOLCANO,
  },
  REVIEWING_SECOND_REVIEWER: {
    label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.REVIEWING_SECOND_REVIEWER],
    color: SEMANTIC_COLORS.PROCESSING,
  },
  APPROVED: {
    label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.APPROVED],
    color: SEMANTIC_COLORS.SUCCESS,
  },
  REJECTED: {
    label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.REJECTED],
    color: SEMANTIC_COLORS.DANGER,
  },
  RETURNED: {
    label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.RETURNED],
    color: SEMANTIC_COLORS.DEFAULT,
  },
  REVOKED: { label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.REVOKED], color: SEMANTIC_COLORS.DEFAULT },
  ARCHIVED: {
    label: REVIEW_STATUS_LABEL_MAP[ReviewStatus.ARCHIVED],
    color: SEMANTIC_COLORS.DEFAULT,
  },
};

/** 文件管理 - 状态 Tab 分组 */
export const FILE_STATUS_TABS: { key: ReviewStatus; label: string }[] = [
  ReviewStatus.DRAFT,
  ReviewStatus.PENDING_REVIEWER,
  ReviewStatus.REVIEWING_REVIEWER,
  ReviewStatus.PENDING_SECOND_REVIEWER,
  ReviewStatus.REVIEWING_SECOND_REVIEWER,
  ReviewStatus.APPROVED,
  ReviewStatus.REJECTED,
  ReviewStatus.RETURNED,
  ReviewStatus.REVOKED,
  ReviewStatus.ARCHIVED,
].map((status) => ({ key: status, label: REVIEW_STATUS_LABEL_MAP[status] }));

/** 审核中心列表不展示的状态（待提交仅在文件管理维护） */
export const REVIEW_CENTER_EXCLUDED_STATUSES: ReviewStatus[] = [ReviewStatus.DRAFT];

export function normalizeReviewCenterStatus(status: string | undefined): string | undefined {
  if (!status) return undefined;
  return REVIEW_CENTER_EXCLUDED_STATUSES.includes(status as ReviewStatus) ? undefined : status;
}

/** 审核列表 - 文件存续状态（与审核状态独立） */
export const REVIEW_FILE_EXISTENCE_STATUS = {
  ACTIVE: { label: '正常', color: SEMANTIC_COLORS.SUCCESS },
  DELETED: { label: '文件已删除', color: SEMANTIC_COLORS.DANGER },
} as const;

export function getReviewFileExistenceStatus(deletedAt?: string | null) {
  return deletedAt ? REVIEW_FILE_EXISTENCE_STATUS.DELETED : REVIEW_FILE_EXISTENCE_STATUS.ACTIVE;
}

export function isReviewFileDeleted(record: { deletedAt?: string | null }): boolean {
  return record.deletedAt != null && record.deletedAt !== '';
}

/** 文件存续状态筛选（正常 / 已删除） */
export type FileExistenceStatus = keyof typeof REVIEW_FILE_EXISTENCE_STATUS;

/** 文件存续状态筛选初始值（页面默认选中正常；清空全部后变为 undefined 即不限） */
export const FILE_EXISTENCE_FILTER_DEFAULT: FileExistenceStatus = 'ACTIVE';

export const FILE_EXISTENCE_FILTER_OPTIONS: { value: FileExistenceStatus; label: string }[] = [
  { value: 'ACTIVE', label: '正常' },
  { value: 'DELETED', label: '已删除' },
];

/** 审核中心 - 我发起的状态分组（不含待提交，草稿在文件管理中处理） */
export const INITIATED_STATUS_GROUPS: { key: ReviewStatus; label: string }[] = [
  ReviewStatus.PENDING_REVIEWER,
  ReviewStatus.REVIEWING_REVIEWER,
  ReviewStatus.PENDING_SECOND_REVIEWER,
  ReviewStatus.REVIEWING_SECOND_REVIEWER,
  ReviewStatus.APPROVED,
  ReviewStatus.REJECTED,
  ReviewStatus.RETURNED,
  ReviewStatus.REVOKED,
  ReviewStatus.ARCHIVED,
].map((status) => ({ key: status, label: REVIEW_STATUS_LABEL_MAP[status] }));

/** 审核中心 - 审核人视角状态分组 */
export const REVIEW_STATUS_GROUPS: { key: ReviewStatus; label: string }[] = [
  ReviewStatus.PENDING_REVIEWER,
  ReviewStatus.REVIEWING_REVIEWER,
  ReviewStatus.PENDING_SECOND_REVIEWER,
  ReviewStatus.REVIEWING_SECOND_REVIEWER,
  ReviewStatus.APPROVED,
  ReviewStatus.REJECTED,
  ReviewStatus.RETURNED,
  ReviewStatus.ARCHIVED,
].map((status) => ({ key: status, label: REVIEW_STATUS_LABEL_MAP[status] }));

/** 审计日志 - 操作类型选项 */
export const AUDIT_ACTION_OPTIONS = [
  { value: 'upload_file', label: '上传文件' },
  { value: 'reupload_file', label: '重新上传' },
  { value: 'download_file', label: '下载文件' },
  { value: 'delete_file', label: '删除文件' },
  { value: 'update_file', label: '更新文件' },
  { value: 'move_file', label: '移动文件' },
  { value: 'create_folder', label: '创建文件夹' },
  { value: 'submit_review', label: '提交审核' },
  { value: 'batch_submit_review', label: '批量提交审核' },
  { value: 'revoke_review', label: '撤回审核' },
  { value: 'batch_revoke_review', label: '批量撤回审核' },
  { value: 'archive_file', label: '归档文件' },
  { value: 'batch_archive_file', label: '批量归档' },
  { value: 'reassess_quality', label: '重新评估质量' },
  { value: 'mark_excellent_case', label: '标记优秀案例' },
  { value: 'review_file', label: '审核文件' },
  { value: 'batch_review', label: '批量审核' },
  { value: 'claim_review', label: '认领审核' },
  { value: 'release_review', label: '释放审核' },
  { value: 'transfer_review', label: '转审' },
  { value: 'create_user', label: '创建用户' },
  { value: 'update_user', label: '更新用户' },
  { value: 'change_member_status', label: '变更成员状态' },
  { value: 'delete_user', label: '删除用户' },
  { value: 'import_users', label: '导入用户' },
  { value: 'create_department', label: '创建部门' },
  { value: 'update_department', label: '更新部门' },
  { value: 'delete_department', label: '删除部门' },
  { value: 'import_departments', label: '导入部门' },
  { value: 'create_feedback', label: '创建反馈' },
  { value: 'update_feedback', label: '更新反馈' },
  { value: 'delete_feedback', label: '删除反馈' },
  { value: 'create_role', label: '创建角色' },
  { value: 'update_role_permissions', label: '更新角色权限' },
  { value: 'delete_role', label: '删除角色' },
  { value: 'virus_detected', label: '病毒拦截' },
];

/** 审计日志 - 操作类型中文映射 */
export const AUDIT_ACTION_LABEL_MAP: Record<string, string> = Object.fromEntries(
  AUDIT_ACTION_OPTIONS.map(({ value, label }) => [value, label]),
);

/** 审计日志 - 对象类型中文映射 */
export const AUDIT_TARGET_TYPE_LABEL_MAP: Record<string, string> = {
  file: '文件',
  folder: '文件夹',
  user: '用户',
  department: '部门',
  feedback: '反馈',
  review: '审核',
  permission: '权限',
};

/** 成员状态映射 */
export const MEMBER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: '在职', color: SEMANTIC_COLORS.SUCCESS },
  ON_LEAVE: { label: '休假中', color: SEMANTIC_COLORS.WARNING },
  RESIGNED: { label: '已离职', color: SEMANTIC_COLORS.DEFAULT },
  DELETED: { label: '已删除', color: SEMANTIC_COLORS.DANGER },
};
