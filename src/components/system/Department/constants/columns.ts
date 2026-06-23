export const DEPT_COLUMNS = [
  { title: '部门名称', dataIndex: 'name', key: 'name', width: 200 },
  { title: '上级部门', dataIndex: 'parentName', key: 'parentName', width: 120 },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
];

export const USER_COLUMNS = [
  { title: '工号', dataIndex: 'employeeId', key: 'employeeId', width: 100 },
  { title: '姓名', dataIndex: 'displayName', key: 'displayName', width: 80 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 160 },
  { title: '电话', dataIndex: 'phone', key: 'phone', width: 110 },
  { title: '所属部门', dataIndex: 'departmentName', key: 'departmentName', width: 200 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 80 },
  { title: '初始密码', dataIndex: 'password', key: 'password', width: 100 },
];
