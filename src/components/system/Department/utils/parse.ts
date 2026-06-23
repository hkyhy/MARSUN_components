import * as XLSX from 'xlsx';
import type { DeptImportRow, UserImportRow } from '../constants';

/** 解析上传的文件 */
export function parseFile(
  file: File,
): Promise<{ departments: DeptImportRow[]; users: UserImportRow[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const departments: DeptImportRow[] = [];
        const deptSheetName =
          workbook.SheetNames.find((n) => n.includes('部门')) || workbook.SheetNames[0];
        if (deptSheetName) {
          const deptSheet = workbook.Sheets[deptSheetName]!;
          const deptJson = XLSX.utils.sheet_to_json<Record<string, string>>(deptSheet, {
            defval: '',
          });
          deptJson.forEach((row, idx) => {
            const name = String(row['部门名称'] ?? row['name'] ?? '').trim();
            if (!name) return;
            departments.push({
              key: idx,
              name,
              parentName: String(row['上级部门'] ?? row['parentName'] ?? '').trim(),
              sort: row['排序'] ?? row['sort'] ?? 0,
            });
          });
        }

        const users: UserImportRow[] = [];
        const userSheetName = workbook.SheetNames.find((n) => n.includes('用户'));
        if (userSheetName) {
          const userSheet = workbook.Sheets[userSheetName]!;
          const userJson = XLSX.utils.sheet_to_json<Record<string, string>>(userSheet, {
            defval: '',
          });
          userJson.forEach((row, idx) => {
            const employeeId = String(row['工号'] ?? row['employeeId'] ?? '').trim();
            if (!employeeId) return;
            users.push({
              key: idx,
              employeeId,
              displayName: String(row['姓名'] ?? row['displayName'] ?? '').trim(),
              email: String(row['邮箱'] ?? row['email'] ?? '').trim(),
              phone: String(row['电话'] ?? row['phone'] ?? '').trim(),
              departmentName: String(row['所属部门'] ?? row['departmentName'] ?? '').trim(),
              role: String(row['角色'] ?? row['role'] ?? '普通用户').trim(),
              password: String(row['初始密码'] ?? row['password'] ?? '').trim(),
            });
          });
        }

        resolve({ departments, users });
      } catch (err) {
        reject(new Error('文件解析失败，请检查文件格式'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsArrayBuffer(file);
  });
}
