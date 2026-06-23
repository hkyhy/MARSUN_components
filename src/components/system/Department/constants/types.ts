/** 部门导入行数据 */
export interface DeptImportRow {
  key: number;
  name: string;
  parentName: string;
  sort: string | number;
}

/** 用户导入行数据 */
export interface UserImportRow {
  key: number;
  employeeId: string;
  displayName: string;
  email: string;
  phone: string;
  departmentName: string;
  role: string;
  password: string;
}
