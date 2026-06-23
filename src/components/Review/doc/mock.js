/** Mock 审核列表数据 */
export const mockReviewList = [
  {
    key: '1',
    fileName: '2026年Q1报告.pdf',
    uploader: '张三',
    department: '技术部',
    status: 'pending',
    date: '2026-05-20',
  },
  {
    key: '2',
    fileName: '技术方案.docx',
    uploader: '李四',
    department: '市场部',
    status: 'reviewing',
    date: '2026-05-19',
  },
  {
    key: '3',
    fileName: '预算表.xlsx',
    uploader: '王五',
    department: '财务部',
    status: 'approved',
    date: '2026-05-18',
  },
  {
    key: '4',
    fileName: '需求分析.pdf',
    uploader: '赵六',
    department: '运营部',
    status: 'rejected',
    date: '2026-05-17',
  },
  {
    key: '5',
    fileName: '年度总结.pptx',
    uploader: '钱七',
    department: '技术部',
    status: 'pending',
    date: '2026-05-16',
  },
];

/** Mock 审核流程步骤 */
export const mockReviewSteps = [
  { title: '提报人提交', description: '张三 提交了文件' },
  { title: '分会审核', description: '李审核人 审核中' },
  { title: '终审', description: '待终审' },
];

/** Mock 审核时间线 */
export const mockReviewTimeline = [
  { user: '李审核人', action: '开始分会审核', time: '05-19 14:30', color: 'blue' },
  { user: '张三', action: '提交审核', time: '05-19 10:00', color: 'green' },
];
