/** Mock 文件夹树数据 */
export const mockTreeData = [
  {
    title: '技术部',
    key: 'd1',
    children: [
      { title: '项目文档', key: 'd1-1' },
      { title: '技术规范', key: 'd1-2' },
      { title: 'API文档', key: 'd1-3' },
    ],
  },
  {
    title: '市场部',
    key: 'd2',
    children: [
      { title: '市场调研', key: 'd2-1' },
      { title: '品牌资料', key: 'd2-2' },
    ],
  },
  { title: '财务部', key: 'd3', children: [{ title: '年度报表', key: 'd3-1' }] },
  { title: '人事部', key: 'd4' },
];

/** Mock 文件列表数据 */
export const mockFiles = [
  {
    key: '1',
    name: '2026年Q1报告.pdf',
    size: '2.4 MB',
    uploader: '张三',
    status: 'approved',
    date: '2026-05-20',
    type: 'pdf',
  },
  {
    key: '2',
    name: '技术方案.docx',
    size: '1.1 MB',
    uploader: '李四',
    status: 'pending',
    date: '2026-05-19',
    type: 'docx',
  },
  {
    key: '3',
    name: '预算表.xlsx',
    size: '856 KB',
    uploader: '王五',
    status: 'reviewing',
    date: '2026-05-18',
    type: 'xlsx',
  },
  {
    key: '4',
    name: '产品设计稿.png',
    size: '5.2 MB',
    uploader: '赵六',
    status: 'rejected',
    date: '2026-05-17',
    type: 'png',
  },
  {
    key: '5',
    name: '会议纪要.docx',
    size: '320 KB',
    uploader: '钱七',
    status: 'approved',
    date: '2026-05-16',
    type: 'docx',
  },
];

/** 面包屑导航数据 */
export const mockBreadcrumb = [{ title: '全部文件' }, { title: '技术部' }, { title: '项目文档' }];
