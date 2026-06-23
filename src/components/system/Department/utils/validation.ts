import type { UserImportRow } from '../constants';

/** 校验用户导入行的必填字段 */
export function validateUserRows(
  rows: UserImportRow[],
  validDeptNames: Set<string>,
  roleMap: Record<string, string>,
): string[] {
  const validRoleLabels = Object.fromEntries(Object.values(roleMap).map((v) => [v, true]));
  const errors: string[] = [];
  rows.forEach((row, idx) => {
    const line = `第 ${idx + 2} 行`;
    if (!row.employeeId.trim()) errors.push(`${line}：工号不能为空`);
    if (!row.displayName.trim()) errors.push(`${line}：姓名不能为空`);
    if (row.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email))
      errors.push(`${line}：邮箱格式不正确`);
    if (!row.departmentName.trim()) errors.push(`${line}：所属部门不能为空`);
    else {
      const parts = row.departmentName
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean);
      const invalidPart = parts.find((p) => !validDeptNames.has(p));
      if (invalidPart)
        errors.push(`${line}：部门「${invalidPart}」不存在（路径：${row.departmentName}）`);
    }
    if (row.role && !validRoleLabels[row.role]) errors.push(`${line}：角色「${row.role}」无效`);
  });
  return errors;
}

/** 角色中文名 → 枚举值 */
export function buildRoleLabelToKeyMap(roleMap: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(roleMap).map(([k, v]) => [v, k]));
}
