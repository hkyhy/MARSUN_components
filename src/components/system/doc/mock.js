/** Mock 部门树数据 */
export const mockDeptTree = [
  {
    title: '总公司',
    key: 'root',
    children: [
      {
        title: '技术部',
        key: 'd1',
        children: [
          { title: '前端组', key: 'd1-1' },
          { title: '后端组', key: 'd1-2' },
          { title: '测试组', key: 'd1-3' },
        ],
      },
      {
        title: '市场部',
        key: 'd2',
        children: [
          { title: '品牌组', key: 'd2-1' },
          { title: '推广组', key: 'd2-2' },
        ],
      },
      { title: '财务部', key: 'd3' },
      { title: '人事部', key: 'd4' },
    ],
  },
];

/** Mock 用户列表数据 */
export const mockUsers = [
  {
    key: '1',
    name: '张三',
    username: 'zhangsan',
    department: '技术部',
    role: 'SYSTEM_ADMIN',
    status: true,
  },
  {
    key: '2',
    name: '李四',
    username: 'lisi',
    department: '市场部',
    role: 'REVIEWER',
    status: true,
  },
  {
    key: '3',
    name: '王五',
    username: 'wangwu',
    department: '财务部',
    role: 'UPLOADER',
    status: false,
  },
  {
    key: '4',
    name: '赵六',
    username: 'zhaoliu',
    department: '人事部',
    role: 'UPLOADER',
    status: true,
  },
  {
    key: '5',
    name: '钱七',
    username: 'qianqi',
    department: '技术部',
    role: 'REVIEWER',
    status: true,
  },
];

/** Mock 权限配置数据 */
export const mockPermissions = [
  {
    module: '文件管理',
    actions: ['查看', '上传', '删除', '提报'],
    roles: {
      SYSTEM_ADMIN: ['查看', '上传', '删除', '提报'],
      REVIEWER: ['查看', '提报'],
      UPLOADER: ['查看', '上传', '提报'],
    },
  },
  {
    module: '审核中心',
    actions: ['查看', '通过', '驳回', '转审'],
    roles: {
      SYSTEM_ADMIN: ['查看', '通过', '驳回', '转审'],
      REVIEWER: ['查看', '通过', '驳回'],
      UPLOADER: ['查看'],
    },
  },
  {
    module: '系统管理',
    actions: ['查看', '用户管理', '部门管理'],
    roles: { SYSTEM_ADMIN: ['查看', '用户管理', '部门管理'], REVIEWER: ['查看'], UPLOADER: [] },
  },
  {
    module: '反馈管理',
    actions: ['查看', '创建', '处理', '关闭'],
    roles: {
      SYSTEM_ADMIN: ['查看', '创建', '处理', '关闭'],
      REVIEWER: ['查看', '处理'],
      UPLOADER: ['查看', '创建'],
    },
  },
];
