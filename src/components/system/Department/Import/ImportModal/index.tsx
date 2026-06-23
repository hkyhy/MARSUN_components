import { deptApi } from '@/api';
import { useRoleOptionsStore } from '@/stores/roleOptionsStore';
import { Download, Upload as UploadIcon } from '@/icons';
import { Alert, Button, Modal, Space, Table, Tabs, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { DEPT_COLUMNS, USER_COLUMNS, type DeptImportRow, type UserImportRow } from '../../constants';
import { buildRoleLabelToKeyMap, downloadTemplate, parseFile, validateUserRows } from '../../utils';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ImportModalProps {
  open: boolean;
  flatDepts: { id: string; name: string }[];
  onCancel: () => void;
  onSuccess: () => void;
}

/** 批量导入组织架构弹窗 */
const ImportModal: React.FC<ImportModalProps> = ({ open, flatDepts, onCancel, onSuccess }) => {
  const fetchRoleOptions = useRoleOptionsStore((s) => s.fetchRoleOptions);
  const roleMap = useRoleOptionsStore((s) => s.roleMap) ?? {};
  const roleOptions = Object.values(roleMap).join('/');
  const deptExample = flatDepts.length > 0 ? flatDepts[0]!.name : '技术部';

  useEffect(() => {
    if (open) fetchRoleOptions().catch(() => {});
  }, [open, fetchRoleOptions]);
  const [importDepts, setImportDepts] = useState<DeptImportRow[]>([]);
  const [importUsers, setImportUsers] = useState<UserImportRow[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string>('');
  const [importValidationErrors, setImportValidationErrors] = useState<string[]>([]);

  const resetState = () => {
    setImportDepts([]);
    setImportUsers([]);
    setImportError('');
    setImportValidationErrors([]);
  };

  const handleFileUpload = async (file: File) => {
    setImportError('');
    setImportValidationErrors([]);
    try {
      const { departments, users } = await parseFile(file);
      if (departments.length === 0 && users.length === 0) {
        setImportError('文件中没有有效数据，请检查是否包含"部门名称"或"工号"列');
        return false;
      }
      setImportDepts(departments);
      setImportUsers(users);

      if (users.length > 0) {
        const validDeptNames = new Set([
          ...flatDepts.map((d) => d.name),
          ...departments.flatMap((d) =>
            d.name.split('/').map((s) => s.trim()).filter(Boolean)
          ),
        ]);
        const errors = validateUserRows(users, validDeptNames, roleMap);
        setImportValidationErrors(errors);
      }
    } catch (err) {
      setImportError((err as Error).message);
    }
    return false;
  };

  const handleImport = async () => {
    if (importDepts.length === 0 && importUsers.length === 0) {
      return;
    }
    if (importValidationErrors.length > 0) {
      return;
    }
    setImportLoading(true);
    try {
      const payload: Record<string, unknown> = {};
      if (importDepts.length > 0) {
        payload.departments = importDepts.map((row) => ({
          name: row.name,
          sort: Number(row.sort) || 0,
        }));
      }
      if (importUsers.length > 0) {
        const labelToKey = buildRoleLabelToKeyMap(roleMap);
        payload.users = importUsers.map((row) => ({
          employeeId: row.employeeId,
          displayName: row.displayName,
          email: row.email || undefined,
          phone: row.phone || undefined,
          departmentName: row.departmentName,
          role: labelToKey[row.role] || row.role,
          password: row.password || undefined,
        }));
      }
      const res = (await deptApi.import(payload)) as unknown as {
        data: {
          departments: { success: number; failed: number; errors: string[] };
          users: { success: number; failed: number; errors: string[] };
        };
      };
      const { departments: dr, users: ur } = res.data;

      const parts: string[] = [];
      if (importDepts.length > 0) parts.push(`部门：成功 ${dr.success}，失败 ${dr.failed}`);
      if (importUsers.length > 0) parts.push(`用户：成功 ${ur.success}，失败 ${ur.failed}`);

      const allErrors = [...dr.errors, ...ur.errors];
      if (dr.failed + ur.failed > 0) {
        const detail = allErrors.slice(0, 5).join('；');
        const suffix = allErrors.length > 5 ? `…等 ${allErrors.length} 条` : '';
        message.warning(`导入完成 — ${parts.join('；')}：${detail}${suffix}`);
      } else {
        message.success(`导入成功 — ${parts.join('；')}`);
      }

      resetState();
      onSuccess();
    } catch {
      /* handled */
    } finally {
      setImportLoading(false);
    }
  };

  const handleCancel = () => {
    resetState();
    onCancel();
  };

  return (
    <Modal
      title="批量导入组织架构"
      open={open}
      width={780}
      okText="确认导入"
      okButtonProps={{
        disabled:
          (importDepts.length === 0 && importUsers.length === 0) ||
          importValidationErrors.length > 0,
        loading: importLoading,
      }}
      onOk={handleImport}
      onCancel={handleCancel}
    >
      <div className={classNames('import-modal-item', styles['import-modal-item'])}>
        <div className={classNames('import-modal-link', styles['import-modal-link'])}>
          <span className={classNames('import-modal-label', styles['import-modal-label'])}>下载模板：</span>
          <Space>
            <Button size="small" icon={<Download />} onClick={() => downloadTemplate()}>
              Excel 模板
            </Button>
          </Space>
        </div>
        <Alert
          type="info"
          showIcon
          message="模板说明"
          description={
            <div>
              <p className={classNames('import-modal-value', styles['import-modal-value'])}>「部门」Sheet：</p>
              <ul className={classNames('import-modal-meta', styles['import-modal-meta'])}>
                <li>
                  <b>部门名称</b>（必填）：支持用 / 分隔的部门路径，如&ldquo;{deptExample}
                  /子部门&rdquo;会自动创建{deptExample}和子部门
                </li>
                <li>
                  <b>上级部门</b>（选填）：已弃用，请直接在部门名称中用 / 表示层级关系
                </li>
                <li>
                  <b>排序</b>（选填）：部门排序号，默认为 0
                </li>
              </ul>
              <p className={classNames('import-modal-value', styles['import-modal-value'])}>「用户」Sheet：</p>
              <ul className={classNames('import-modal-icon', styles['import-modal-icon'])}>
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
                  /子部门&rdquo;，路径中的每一级部门需已存在或在本文件的部门 Sheet 中
                </li>
                <li>
                  <b>角色</b>（选填）：{roleOptions}，默认普通用户
                </li>
                <li>
                  <b>初始密码</b>（选填）：留空默认 hm+工号
                </li>
              </ul>
            </div>
          }
          className={classNames('import-modal-title', styles['import-modal-title'])}
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

      {importError && <Alert type="error" message={importError} className={classNames('import-modal-desc', styles['import-modal-desc'])} />}

      {importValidationErrors.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message={`用户数据校验失败（${importValidationErrors.length} 项）`}
          description={
            <ul className={classNames('import-modal-actions', styles['import-modal-actions'])}>
              {importValidationErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          }
          className={classNames('import-modal-desc', styles['import-modal-desc'])}
        />
      )}

      {(importDepts.length > 0 || importUsers.length > 0) && (
        <div className={classNames('import-modal-toolbar', styles['import-modal-toolbar'])}>
          <Tabs
            items={[
              ...(importDepts.length > 0
                ? [
                    {
                      key: 'dept',
                      label: `部门（${importDepts.length} 条）`,
                      children: (
                        <Table
                          rowKey="key"
                          columns={DEPT_COLUMNS}
                          dataSource={importDepts}
                          size="small"
                          pagination={{ pageSize: 5 }}
                          scroll={{ y: 240 }}
                        />
                      ),
                    },
                  ]
                : []),
              ...(importUsers.length > 0
                ? [
                    {
                      key: 'user',
                      label: `用户（${importUsers.length} 条）`,
                      children: (
                        <Table
                          rowKey="key"
                          columns={USER_COLUMNS}
                          dataSource={importUsers}
                          size="small"
                          pagination={{ pageSize: 5 }}
                          scroll={{ y: 240 }}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      )}
    </Modal>
  );
};

export default ImportModal;
