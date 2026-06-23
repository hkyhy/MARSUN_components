/** 资产贡献榜模块类型定义 */

/** 实时动态播报项 */
export interface BroadcastItem {
  id: string;
  uploaderName: string;
  departmentId: string;
  departmentName: string;
  fileName: string;
  reviewStatus: string;
  createdAt: string;
}

/** 排行榜项（Top5 简化版） */
export interface LeaderboardItem {
  rank: number;
  departmentName?: string;
  userName?: string;
  totalScore: number;
  fileCount: number;
  approvedCount: number;
  avgScore?: number;
  deptAvgScore?: number;
  companyAvgScore?: number;
}

/** 上传量排行项（完整版，用于详情表格） */
export interface UploadVolumeItem {
  rank: number;
  userId?: string;
  userName?: string;
  departmentName?: string;
  departmentId?: string;
  fileCount: number;
  totalSize: number;
  activeUploaders?: number;
}

/** 质量积分排行项（完整版，用于详情表格） */
export interface QualityScoreItem {
  rank: number;
  userId?: string;
  userName?: string;
  departmentName?: string;
  departmentId?: string;
  approvedCount: number;
  effectiveCount?: number;
  belowLineCount?: number;
  totalScore: number;
  avgScore?: number;
  deptAvgScore?: number;
  companyAvgScore?: number;
  activeUploaders?: number;
  perCapitaScore?: number;
}
