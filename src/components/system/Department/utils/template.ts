import * as XLSX from 'xlsx';

/** 下载导入模板（双 Sheet） */
export function downloadTemplate() {
  const deptHeaders = ['部门名称', '上级部门', '排序'];
  const deptExamples = [
    ['华茂集团/技术部', '', '1'],
    ['华茂集团/前端组', '', '2'],
    ['茂阳数智', '', '3'],
  ];
  const deptWs = XLSX.utils.aoa_to_sheet([deptHeaders, ...deptExamples]);
  deptWs['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 10 }];

  const userHeaders = ['工号', '姓名', '邮箱', '电话', '所属部门', '角色', '初始密码'];
  const userExamples = [
    ['zhangsan', '张三', '', '13800138000', '华茂集团/前端组', '普通用户', '123456'],
    ['lisi', '李四', '', '', '茂阳数智', '普通用户', ''],
  ];
  const userWs = XLSX.utils.aoa_to_sheet([userHeaders, ...userExamples]);
  userWs['!cols'] = [
    { wch: 14 },
    { wch: 12 },
    { wch: 26 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, deptWs, '部门');
  XLSX.utils.book_append_sheet(wb, userWs, '用户');

  XLSX.writeFile(wb, '组织架构导入模板.xlsx', { bookType: 'xlsx' });
}
