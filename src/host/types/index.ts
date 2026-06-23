/** 用户角色枚举（值与后端 Prisma 枚举一致，大写格式） */
export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  DEPT_LEADER = 'DEPT_LEADER',
  REVIEWER = 'REVIEWER',
  NORMAL_USER = 'NORMAL_USER',
  SENIOR_EXECUTIVE = 'SENIOR_EXECUTIVE',
}

/** 成员状态枚举 */
export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  RESIGNED = 'RESIGNED',
  DELETED = 'DELETED',
}

/** 文件审核状态（值与后端 Prisma 枚举一致） */
export enum ReviewStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEWER = 'PENDING_REVIEWER',
  REVIEWING_REVIEWER = 'REVIEWING_REVIEWER',
  PENDING_SECOND_REVIEWER = 'PENDING_SECOND_REVIEWER',
  REVIEWING_SECOND_REVIEWER = 'REVIEWING_SECOND_REVIEWER',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
  REVOKED = 'REVOKED',
  ARCHIVED = 'ARCHIVED',
}

/** 反馈状态（值与后端 Prisma 枚举一致） */
export enum FeedbackStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  CLOSED = 'CLOSED',
}

/** 用户信息 */
export interface UserInfo {
  id: string;
  employeeId: string;
  displayName: string;
  email: string;
  phone?: string;
  role: string;
  /** 角色显示名（由接口解析，含自定义角色） */
  roleName?: string;
  departmentId: string;
  departmentName: string;
  superiorId?: string | null;
  superiorName?: string | null;
  memberStatus: MemberStatus;
  statusRemark?: string;
  resignedAt?: string;
  resignedAttachment?: string;
  avatar?: string;
  createdAt: string;
}

/** 部门信息 */
export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  sort: number;
  memberCount: number;
  children?: Department[];
}

/** 文件元数据 */
export interface FileItem {
  id: string;
  name: string;
  type: 'FILE' | 'FOLDER';
  size?: number;
  mimeType?: string;
  extension?: string;
  path?: string;
  parentId: string | null;
  /** 公共文件夹/文件无部门归属，为 null */
  departmentId?: string | null;
  departmentName?: string;
  uploaderId: string;
  uploaderName: string;
  reviewStatus: ReviewStatus;
  fileScope?: 'DEPARTMENT' | 'PUBLIC';
  version: number;
  tags?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  /** 是否为系统部门文件夹（与部门镜像绑定，不可手动修改） */
  isDepartmentFolder?: boolean;
  /** 是否为公共文件夹（脱离部门，从根目录创建，所有用户可见） */
  isPublic?: boolean;
  /** 软删除时间；有值表示文件已删除 */
  deletedAt?: string | null;
  /** 删除人姓名（已删除时由审计日志解析） */
  deletedByName?: string | null;
  baseScore?: number;
  qualityScore?: number;
  effectScore?: number;
  behaviorScore?: number;
  totalScore?: number;
  aiAssessment?: AiAssessment | null;
  isExcellentCase?: boolean;
  effectStats?: EffectStats | null;
  children?: FileItem[];
}

/** AI 质量评估等级 */
export type QualityLevel = 'high' | 'medium' | 'low';

/** AI 质量评估结果 */
export interface AiAssessment {
  level: QualityLevel;
  summary: string;
  dimensions?: {
    completeness?: string;
    clarity?: string;
    practicalValue?: string;
    formatting?: string;
  };
  assessedAt: string;
  fallback?: boolean;
  /** 内容无法自动读取（如视频、图片），需人工评估 */
  contentUnavailable?: boolean;
}

/** AI 评估任务状态 */
export type AssessmentTaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

/** AI 评估任务 */
export interface AssessmentTaskItem {
  id: string;
  fileId: string;
  fileName: string;
  type: string;
  status: AssessmentTaskStatus;
  triggeredBy: string | null;
  triggererName: string | null;
  result: AiAssessment | null;
  errorMsg: string | null;
  retryCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 效果统计快照 */
export interface EffectStats {
  citationCount: number;
  likeCount: number;
  citationScore: number;
  likeScore: number;
}

/** 四类积分配置 */
export interface PointConfig {
  base: { pointsPerFile: number };
  quality: { high: number; medium: number; low: number };
  effect: {
    citation: {
      tier1Count: number;
      tier1Points: number;
      tier2Count: number;
      tier2Points: number;
      tier3Points: number;
    };
    like: { pointsPerLike: number };
    excludeSelf: boolean;
  };
  behavior: {
    excellentCasePoints: number;
    maxPerReviewerPerMonth: number;
  };
}

/** 审核记录 */
export interface ReviewRecord {
  id: string;
  fileId: string;
  version: number;
  status: ReviewStatus;
  reviewerId?: string;
  reviewerName?: string;
  baseScore?: number;
  qualityScore?: number;
  totalScore?: number;
  dimensionScores?: Record<string, number>;
  comment?: string;
  reason?: string;
  transferFrom?: string;
  transferTo?: string;
  transferredAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** 审计日志 */
export interface AuditLogItem {
  id: string;
  operatorId: string;
  operatorName: string;
  action: string;
  targetType: string;
  targetId: string;
  detail: string;
  ip: string;
  createdAt: string;
}

/** 统计数据 */
export interface StatisticsOverview {
  // 全局
  totalFiles: number;
  totalSize: number;
  todayUploads: number;
  pendingReviews: number;
  pendingReviewer: number;
  reviewingReviewer: number;
  pendingSecondReviewer: number;
  reviewingSecondReviewer: number;
  totalUsers: number;
  totalDepartments: number;
  // 个人
  myFiles: number;
  myApprovedFiles: number;
  myPendingFiles: number;
  myPendingReviewer: number;
  myReviewingReviewer: number;
  myPendingSecondReviewer: number;
  myReviewingSecondReviewer: number;
  myRejectedFiles: number;
  myTodayUploads: number;
  // 部门（DEPT_LEADER）
  deptFiles: number;
  deptTodayUploads: number;
  deptMembers: number;
  deptPendingReviews: number;
  deptPendingReviewer: number;
  deptReviewingReviewer: number;
  deptPendingSecondReviewer: number;
  deptReviewingSecondReviewer: number;
  deptApprovedFiles: number;
  // 审核（REVIEWER / SYSTEM_ADMIN）
  myPendingReviews: number;
  myReviewPendingReviewer: number;
  myReviewReviewingReviewer: number;
  myProcessedReviews: number;
}

export interface DepartmentStat {
  departmentId: string;
  departmentName: string;
  parentId: string | null;
  fileCount: number;
  memberCount: number;
  totalSize: number;
  uploadCount: number;
  ratio: number;
  children?: DepartmentStat[];
}

/** 部门积分统计 */
export interface DeptPointsStat {
  departmentId: string;
  departmentName: string;
  departmentPath: string;
  parentId: string | null;
  memberCount: number;
  fileCount: number;
  totalScore: number;
  children?: DeptPointsStat[];
}

/** 个人积分统计 */
export interface PersonalPointsStat {
  userId: string;
  displayName: string;
  employeeId: string;
  departmentPath: string;
  fileCount: number;
  totalScore: number;
}

/** 个人文件积分明细 */
export interface PersonalPointsFile {
  id: string;
  fileName: string;
  totalScore: number;
  createdAt: string;
}

/** 统计分析筛选参数 */
export interface StatsFilterParams {
  startDate?: string;
  endDate?: string;
  days?: number;
  period?: string;
  departmentId?: string;
  keyword?: string;
}

/** 上传趋势数据点 */
export interface UploadTrendPoint {
  date: string;
  count: number;
  totalSize: number;
}

/** 文件类型分布 */
export interface FileTypeStat {
  extension: string;
  count: number;
}

export interface RecentUpload {
  id: string;
  fileName: string;
  uploaderName: string;
  departmentName: string;
  size: number;
  createdAt: string;
}

/** 分页参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 反馈项 */
export interface FeedbackItem {
  id: string;
  title: string;
  content: string;
  category: string;
  status: FeedbackStatus;
  priority: string;
  creatorId?: string;
  creatorName: string;
  creatorDeptId?: string;
  creatorDept: string;
  assigneeId?: string;
  assigneeName?: string;
  resolution?: string;
  commentCount: number;
  comments?: FeedbackComment[];
  relatedFileId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackComment {
  id: string;
  content: string;
  authorId: string;
  author?: { displayName: string; avatar?: string };
  parentId?: string;
  createdAt: string;
}

/** 反馈流转记录 */
export interface FeedbackRecord {
  id: string;
  feedbackId: string;
  action: string;
  operatorId: string;
  operatorName?: string;
  comment?: string;
  fromStatus?: string;
  toStatus?: string;
  fromAssignee?: string;
  toAssignee?: string;
  fromAssigneeName?: string;
  toAssigneeName?: string;
  createdAt: string;
}

/** 当前用户角色权限（来自 /auth/my-permissions） */
export interface UserRolePermissions {
  key: string;
  name: string;
  permissions: string[];
  permCount: number;
}

/** 角色元数据（来自 /permissions/role-options） */
export interface RoleOptionsPayload {
  roleList: { key: string; name: string }[];
  roleMap: Record<string, string>;
}

/** 全量权限定义项（管理端 /permissions/permissions） */
export interface PermissionDefinition {
  key: string;
  name: string;
  category: string;
  categoryLabel?: string;
  description?: string;
  roles?: string[];
}

/** 全量权限定义响应（来自 /permissions/permissions） */
export interface PermissionDefinitionsResponse {
  permissions: PermissionDefinition[];
  categories: Record<string, string>;
  permissionMap: Record<string, string>;
}

/** 角色权限配置 */
export interface RoleConfig {
  key: string;
  name: string;
  permissions: string[];
  userCount: number;
  permCount: number;
  /** 手动添加角色的创建人 ID */
  createdBy?: string;
  /** 手动添加角色的创建人姓名 */
  createdByName?: string;
  /** 手动添加角色的创建时间 */
  createdAt?: string;
}

/** 审核记录（含文件信息，用于审核列表） */
export interface ReviewListItem {
  id: string;
  fileId?: string;
  name?: string;
  fileName?: string;
  departmentId?: string;
  departmentName?: string;
  uploaderName?: string;
  reviewStatus?: string;
  fileScope?: 'DEPARTMENT' | 'PUBLIC';
  action?: string;
  status?: string;
  baseScore?: number;
  qualityScore?: number;
  totalScore?: number;
  dimensionScores?: Record<string, number>;
  comment?: string;
  reason?: string;
  reviewerName?: string;
  extension?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  /** 软删除时间；有值表示文件已从文件管理中删除 */
  deletedAt?: string | null;
  /** 删除人姓名（已删除时由审计日志解析） */
  deletedByName?: string | null;
}

/** 评分维度 */
export interface ScoringDimension {
  key: string;
  name: string;
  weight: number;
  maxScore: number;
}

/** 评分模型配置 */
export interface ScoringModel {
  dimensions: ScoringDimension[];
  totalMaxScore: number;
  passLine: number;
}

/** 通用API响应 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// ─────────────────────────────────────────────────────────────────────────────
// AgentHub — 智能中枢模块类型定义
// ─────────────────────────────────────────────────────────────────────────────

/** 文档解析状态（对应 RAGFlow run 字段） */
export enum ParseStatus {
  UNSTART = 'UNSTART',
  RUNNING = 'RUNNING',
  DONE = 'DONE',
  FAIL = 'FAIL',
  CANCEL = 'CANCEL',
}

/** RAG 知识库（Dataset） */
export interface Dataset {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  chunk_count: number;
  document_count: number;
  token_num: number;
  embedding_model?: string;
  chunk_method?: string;
  parser_config?: Record<string, unknown>;
  permission?: string;
  similarity_threshold?: number;
  vector_similarity_weight?: number;
  status?: string;
  tenant_id?: string;
  created_by?: string;
  create_time?: string | number;
  update_time?: string | number;
  /** 包含解析进度时可用 */
  done_count?: number;
  running_count?: number;
  fail_count?: number;
  unstart_count?: number;
  cancel_count?: number;
}

/** 知识库文档 */
export interface KBDocument {
  id: string;
  name: string;
  location?: string;
  dataset_id: string;
  type?: string;
  size?: number;
  chunk_method?: string;
  run?: ParseStatus | string;
  chunk_count?: number;
  token_num?: number;
  thumbnail?: string;
  progress?: number;
  progress_msg?: string;
  created_by?: string;
  create_time?: string | number;
  update_time?: string | number;
}

/** 问答助手（Chat Assistant） */
export interface ChatAssistant {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  language?: string;
  llm_id?: string;
  llm_setting?: {
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  };
  dataset_ids?: string[];
  kb_names?: string[];
  prompt_config?: {
    prologue?: string;
    system?: string;
    empty_response?: string;
    quote?: boolean;
    parameters?: { key: string; optional: boolean }[];
  };
  similarity_threshold?: number;
  vector_similarity_weight?: number;
  top_n?: number;
  status?: string;
  tenant_id?: string;
  create_time?: string | number;
  update_time?: string | number;
}

/** 聊天会话 */
export interface ChatSession {
  id: string;
  name?: string;
  chat_id: string;
  messages?: ChatMessage[];
  /** @deprecated RAGFlow 原始字段，优先使用 messages */
  message?: ChatMessage[];
  reference?: Array<{ chunks?: Citation[] } | Record<string, unknown>>;
  create_time?: string | number;
  update_time?: string | number;
}

/** 聊天消息角色 */
export type MessageRole = 'user' | 'assistant' | 'system';

/** 引用来源文档片段 */
export interface Citation {
  id?: string;
  doc_id?: string;
  doc_name?: string;
  dataset_id?: string;
  content?: string;
  score?: number;
  positions?: number[][];
  page_no?: number | null;
}

/** 聊天消息 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  /** 流式输出时是否仍在生成 */
  streaming?: boolean;
  /** 用户反馈：true 赞 / false 踩 */
  thumbup?: boolean;
  create_time?: string | number;
}

/** SSE 流式响应 chunk（解析后） */
export interface SSEChunk {
  answer?: string;
  reference?: {
    chunks?: Citation[];
    doc_aggs?: { doc_id: string; doc_name: string; count: number }[];
  };
  prompt?: string;
  session_id?: string;
  retcode?: number;
  retmsg?: string;
}
