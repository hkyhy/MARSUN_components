

/** 实时播报 mock 数据 */
export const mockBroadcastList: BroadcastItem[] = [
  {
    id: '1',
    uploaderName: '张三',
    departmentId: 'd1',
    departmentName: '技术部',
    fileName: '2026年Q1技术报告.pdf',
    reviewStatus: 'APPROVED',
    createdAt: '2026-05-21 10:30',
  },
  {
    id: '2',
    uploaderName: '李四',
    departmentId: 'd2',
    departmentName: '市场部',
    fileName: '市场调研分析.docx',
    reviewStatus: 'PENDING_REVIEW',
    createdAt: '2026-05-21 09:15',
  },
  {
    id: '3',
    uploaderName: '王五',
    departmentId: 'd3',
    departmentName: '财务部',
    fileName: '年度预算表.xlsx',
    reviewStatus: 'REVIEWING',
    createdAt: '2026-05-21 08:00',
  },
  {
    id: '4',
    uploaderName: '赵六',
    departmentId: 'd4',
    departmentName: '运营部',
    fileName: '运营月报.pdf',
    reviewStatus: 'APPROVED',
    createdAt: '2026-05-20 16:45',
  },
  {
    id: '5',
    uploaderName: '钱七',
    departmentId: 'd1',
    departmentName: '技术部',
    fileName: 'API设计文档.docx',
    reviewStatus: 'REJECTED',
    createdAt: '2026-05-20 14:20',
  },
];

/** 排行榜 mock 数据 */
export const mockLeaderboard: LeaderboardItem[] = [
  {
    rank: 1,
    departmentName: '技术部',
    totalScore: 96.5,
    fileCount: 128,
    approvedCount: 120,
    avgScore: 4.8,
  },
  {
    rank: 2,
    departmentName: '市场部',
    totalScore: 89.2,
    fileCount: 95,
    approvedCount: 88,
    avgScore: 4.5,
  },
  {
    rank: 3,
    departmentName: '财务部',
    totalScore: 82.1,
    fileCount: 76,
    approvedCount: 72,
    avgScore: 4.3,
  },
  {
    rank: 4,
    departmentName: '人事部',
    totalScore: 75.8,
    fileCount: 62,
    approvedCount: 58,
    avgScore: 4.1,
  },
  {
    rank: 5,
    departmentName: '运营部',
    totalScore: 68.3,
    fileCount: 51,
    approvedCount: 47,
    avgScore: 3.9,
  },
];
