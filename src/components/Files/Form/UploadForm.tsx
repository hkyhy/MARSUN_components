import { CommonUpload } from '@/components/Common';
import { hasPermission } from '@/components/Common/Auth';
import FolderTreeSelect from './FolderTreeSelect';
import { FILE_TYPE_LABEL_MAP, MAX_FILE_SIZE } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Form, Input } from 'antd';
import React, { useEffect, useMemo } from 'react';

/** 文件所属范围选项 */
export const FILE_SCOPE_OPTIONS = [
  { value: 'DEPARTMENT', label: '部门级' },
  { value: 'PUBLIC', label: '公共文件' },
] as const;

export type FileScope = (typeof FILE_SCOPE_OPTIONS)[number]['value'];

interface UploadFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  /** 上传组件变体：panel=拖拽面板，button=按钮（默认） */
  variant?: 'panel' | 'button';
}

/** 上传文件表单字段 */
const UploadForm: React.FC<UploadFormProps> = ({ form, variant }) => {
  const { user } = useAuthStore();
  const { settings } = useSettingsStore();
  const allowedFileTypes = settings.allowedFileTypes;
  const canSelectFolder = hasPermission(user, 'file:upload:folder');

  const accept = useMemo(
    () => Object.values(allowedFileTypes).flat().join(','),
    [allowedFileTypes],
  );

  const typeNames = useMemo(
    () =>
      Object.keys(allowedFileTypes)
        .map((k) => FILE_TYPE_LABEL_MAP[k] || k)
        .join('/'),
    [allowedFileTypes],
  );

  // const { user } = useAuthStore();
  // const { getDepartmentPath } = useDepartmentPath();
  // const deptName = user?.departmentId ? getDepartmentPath(user.departmentId) : undefined;

  // 监听 files 变化，单文件时显示文件名字段
  const filesValue = Form.useWatch('files', form);
  const singleFile = filesValue?.length === 1 ? filesValue[0] : null;

  // 单文件选中时自动填充文件名
  useEffect(() => {
    if (singleFile) {
      form.setFieldValue('name', singleFile.name);
    } else {
      form.setFieldValue('name', undefined);
    }
  }, [singleFile, form]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="files" label="上传文件" rules={[{ required: true, message: '请上传文件' }]}>
        <CommonUpload
          variant={variant}
          accept={accept}
          fileSize={MAX_FILE_SIZE}
          multiple
          renderTips={() => (
            <span>
              支持 {typeNames}，单文件最大 {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}M
            </span>
          )}
        />
      </Form.Item>

      {singleFile && (
        <Form.Item name="name" label="文件名" rules={[{ required: true, message: '请输入文件名' }]}>
          <Input placeholder="请输入文件名" />
        </Form.Item>
      )}

      {canSelectFolder && (
        <Form.Item name="parentId" label="目标文件夹">
          <FolderTreeSelect placeholder="选择目标文件夹（不选则上传到默认目录）" />
        </Form.Item>
      )}

      {/* <Form.Item label="所属部门">
        <span className={classNames('upload-form-dept-name', styles['upload-form-dept-name'])}>{deptName || '未分配部门'}</span>
      </Form.Item> */}

      <Form.Item name="description" label="描述" hidden>
        <Input.TextArea placeholder="简要描述上传内容（可选）" />
      </Form.Item>

      <Form.Item name="tags" label="标签" hidden>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default UploadForm;
