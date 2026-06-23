import { userApi } from '@/api';
import {
  buildRoleLabelToKeyMap,
  validateUserRows,
} from '@/components/system/Department/utils/validation';
import { useRoleOptionsStore } from '@/stores/roleOptionsStore';
import { Download, Upload as UploadIcon } from '@/icons';
import { Alert, Button, Modal, Space, Table, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import styles from './style.module.scss';
import classNames from 'classnames';

interface UserImportRow {
  key: number;
  employeeId: string;
  displayName: string;
  email: string;
  phone: string;
  departmentName: string;
  role: string;
  password: string;
}

const USER_IMPORT_COLUMNS: ColumnsType<UserImportRow> = [
  { title: '工号', dataIndex: 'employeeId', key: 'employeeId', width: 100 },
  { title: '姓名', dataIndex: 'displayName', key: 'displayName', width: 80 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 160 },
  { title: '电话', dataIndex: 'phone', key: 'phone', width: 110 },
  { title: '所属部门', dataIndex: 'departmentName', key: 'departmentName', width: 200 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 80 },
  { title: '初始密码', dataIndex: 'password', key: 'password', width: 100 },
];

interface UserImportModalProps {
  open: boolean;
  /** 部门名称集合（用于校验） */
  deptNames: Set<string>;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 下载用户导入模板 */
function downloadUserTemplate(deptNames: Set<string>) {
  const headers = ['工号', '姓名', '邮箱', '电话', '所属部门', '角色', '初始密码'];
  // 取前两个实际部门名作为示例
  const deptList = [...deptNames];
  const deptExample1 = deptList.length > 0 ? deptList[0] : '技术部';
  const deptExample2 = deptList.length > 1 ? deptList[1] : deptExample1;
  const examples = [
    ['zhangsan', '张三', '', '13800138000', deptExample1, '普通用户', '123456'],
    ['lisi', '李四', '', '', deptExample2, '普通用户', ''],
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...examples]);
  ws['!cols'] = [
    { wch: 14 },
    { wch: 12 },
    { wch: 26 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '用户');

  XLSX.writeFile(wb, '用户导入模板.xlsx', { bookType: 'xlsx' });
}

/** 解析上传的用户文件 */
function parseUserFile(file: File): Promise<UserImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const users: UserImportRow[] = [];
        const sheetName =
          workbook.SheetNames.find((n) => n.includes('用户')) || workbook.SheetNames[0];
        if (sheetName) {
          const sheet = workbook.Sheets[sheetName]!;
          const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
          json.forEach((row, idx) => {
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
        resolve(users);
      } catch {
        reject(new Error('文件解析失败，请检查文件格式'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsArrayBuffer(file);
  });
}

const UserImportModal: React.FC<UserImportModalProps> = ({
  open,
  deptNames,
  onCancel,
  onSuccess,
}) => {
  const fetchRoleOptions = useRoleOptionsStore((s) => s.fetchRoleOptions);
  const roleMap = useRoleOptionsStore((s) => s.roleMap) ?? {};
  const roleOptions = Object.values(roleMap).join('/');
  const deptList = [...deptNames];

  useEffect(() => {
    if (open) fetchRoleOptions().catch(() => {});
  }, [open, fetchRoleOptions]);
  const deptExample = deptList.length > 0 ? deptList[0] : '技术部';

  const [importRows, setImportRows] = useState<UserImportRow[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importValidationErrors, setImportValidationErrors] = useState<string[]>([]);

  const resetState = () => {
    setImportRows([]);
    setImportError('');
    setImportValidationErrors([]);
  };

  const handleFileUpload = async (file: File) => {
    setImportError('');
    setImportValidationErrors([]);
    try {
      const rows = await parseUserFile(file);
      if (rows.length === 0) {
        setImportError('文件中没有有效数据，请检查是否包含"工号"列');
        return false;
      }
      setImportRows(rows);
      const errors = validateUserRows(rows, deptNames, roleMap);
      setImportValidationErrors(errors);
    } catch (err) {
      setImportError((err as Error).message);
    }
    return false;
  };

  const handleImport = async () => {
    if (importRows.length === 0) {
      message.warning('请先上传文件');
      return;
    }
    if (importValidationErrors.length > 0) {
      message.warning('请先修正用户数据中的错误');
      return;
    }
    setImportLoading(true);
    try {
      const labelToKey = buildRoleLabelToKeyMap(roleMap);
      const users = importRows.map((row) => ({
        employeeId: row.employeeId,
        displayName: row.displayName,
        email: row.email || undefined,
        phone: row.phone || undefined,
        departmentName: row.departmentName,
        role: labelToKey[row.role] || row.role,
        password: row.password || undefined,
      }));
      const res = (await userApi.import({ users })) as unknown as {
        data: { success: number; failed: number; errors: string[] };
      };
      const { success, failed, errors } = res.data;
      if (failed > 0) {
        const detail = errors.slice(0, 5).join('；');
        const suffix = errors.length > 5 ? `…等 ${errors.length} 条` : '';
        message.warning(`导入完成 — 成功 ${success}，失败 ${failed}：${detail}${suffix}`);
      } else {
        message.success(`导入成功 — 共 ${success} 条`);
      }
      onCancel();
      resetState();
      onSuccess();
    } catch {
      // 错误已由全局拦截器提示
    } finally {
      setImportLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    resetState();
  };

  return (
    <Modal
      title="批量导入用户"
      open={open}
      width={780}
      okText="确认导入"
      okButtonProps={{
        disabled: importRows.length === 0 || importValidationErrors.length > 0,
        loading: importLoading,
      }}
      onOk={handleImport}
      onCancel={handleCancel}
    >
      <div className={classNames('user-import-modal-label', styles['user-import-modal-label'])}>
        <div className={classNames('user-import-modal-value', styles['user-import-modal-value'])}>
          <span className={classNames('user-import-modal-meta', styles['user-import-modal-meta'])}>下载模板：</span>
          <Space>
            <Button
              size="small"
              icon={<Download />}
              onClick={() => downloadUserTemplate(deptNames)}
            >
              Excel 模板
            </Button>
          </Space>
        </div>
        <Alert
          type="info"
          showIcon
          message="模板说明"
          description={
            <ul className={classNames('user-import-modal-icon', styles['user-import-modal-icon'])}>
              <li>
                <b>工号</b>（必填）：用户登录账号，唯一
              </li>
              <li>
                <b>姓名</b>（必填）：用户显示名称
              </li>
              <li>
                <b>邮箱</b>（选填）：用户邮箱地址
              </li>
              <li>
                <b>电话</b>（选填）：联系电话
              </li>
              <li>
                <b>所属部门</b>（必填）：支持用 / 分隔的部门路径，如&ldquo;{deptExample}
                /子部门&rdquo;，路径中的每一级部门需已存在
              </li>
              <li>
                <b>角色</b>（选填）：{roleOptions}，默认普通用户
              </li>
              <li>
                <b>初始密码</b>（选填）：留空默认 hm+工号
              </li>
            </ul>
          }
          className={classNames('user-import-modal-title', styles['user-import-modal-title'])}
        />
      </div>

      <Upload
        accept=".xlsx,.xls"
        maxCount={1}
        showUploadList={false}
        beforeUpload={handleFileUpload}
      >
        <Button icon={<UploadIcon />}>选择文件（支持 .xlsx / .xls）</Button>
      </Upload>

      {importError && <Alert type="error" message={importError} className={classNames('user-import-modal-desc', styles['user-import-modal-desc'])} />}

      {importValidationErrors.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message={`数据校验失败（${importValidationErrors.length} 项）`}
          description={
            <ul className={classNames('user-import-modal-actions', styles['user-import-modal-actions'])}>
              {importValidationErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          }
          className={classNames('user-import-modal-desc', styles['user-import-modal-desc'])}
        />
      )}

      {importRows.length > 0 && (
        <div className={classNames('user-import-modal-toolbar', styles['user-import-modal-toolbar'])}>
          <Table
            rowKey="key"
            columns={USER_IMPORT_COLUMNS}
            dataSource={importRows}
            size="small"
            pagination={{ pageSize: 5 }}
            scroll={{ y: 240 }}
          />
        </div>
      )}
    </Modal>
  );
};

export default UserImportModal;
