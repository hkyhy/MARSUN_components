import { fileApi } from '@/api';
import { CommonUpload, StepForm, type StepFormItem } from '@/components/Common';
import FolderTreeSelect from '@/components/Files/Form/FolderTreeSelect';
import { MAX_FILE_SIZE } from '@/constants';
import {
  CircleCheck,
  CircleAlert,
  ShieldCheck,
} from '@/icons';
import { Alert, Button, Form, Modal, Result, Spin, Tree, Typography } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useCallback, useMemo, useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';
import { buildTreeData, partitionFolderFiles, resolveRelativePath } from '../folderImport';

interface FolderUploadModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 导入结果 */
interface ImportResult {
  created: { folders: number; files: number };
  skipped: { name: string; reason: string }[];
}

/**
 * 上传文件夹（目录导入）弹窗 — 仅超级管理员
 *
 * 选择一个公共目标文件夹，上传整个目录（含子目录），
 * 在后端重建嵌套结构为公共、已审核通过的文件夹/文件。
 */
const FolderUploadModal: React.FC<FolderUploadModalProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState('select');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const watchedFiles = Form.useWatch('files', form) as UploadFile[] | undefined;
  const { valid, filtered } = useMemo(
    () => partitionFolderFiles(watchedFiles ?? []),
    [watchedFiles],
  );
  const treeData = useMemo(() => buildTreeData(valid), [valid]);

  const handleReset = useCallback(() => {
    form.resetFields();
    setResult(null);
    setUploading(false);
    setCurrent('select');
  }, [form]);

  const handleCancel = useCallback(() => {
    handleReset();
    onCancel();
  }, [handleReset, onCancel]);

  const handleStartUpload = useCallback(async (): Promise<boolean> => {
    const fileList = (form.getFieldValue('files') as UploadFile[]) || [];
    if (!fileList.length) {
      Modal.error({ title: '无法上传', content: '请选择要上传的文件夹' });
      return false;
    }

    // 仅上传系统可上传范畴内的文件，自动过滤系统/垃圾及不支持的文件
    const { valid: validFiles } = partitionFolderFiles(fileList);
    if (!validFiles.length) {
      Modal.error({
        title: '无法上传',
        content: '所选文件夹内没有可上传的文件（已全部被过滤）',
      });
      return false;
    }

    const parentId = (form.getFieldValue('parentId') as string | undefined) ?? '';

    const formData = new FormData();
    const paths: string[] = [];
    for (const f of validFiles) {
      if (!f.originFileObj) continue;
      formData.append('files', f.originFileObj as File);
      paths.push(resolveRelativePath(f));
    }
    if (!paths.length) {
      Modal.error({ title: '无法上传', content: '所选文件夹内没有可上传的文件' });
      return false;
    }
    formData.append('paths', JSON.stringify(paths));
    formData.append('parentId', parentId || 'root');

    setUploading(true);
    try {
      const res = (await fileApi.importPublicFolder(formData)) as unknown as {
        data: ImportResult;
      };
      setResult(res.data);
      const { folders, files } = res.data.created;
      const skipped = res.data.skipped ?? [];
      Modal.success({
        title: '上传成功',
        content: (
          <div>
            <div>{`新建 ${folders} 个文件夹、${files} 个文件`}</div>
            {skipped.length > 0 && (
              <div className={classNames('folder-upload-modal-skipped-block', styles['folder-upload-modal-skipped-block'])}>
                <div className={classNames('folder-upload-modal-skipped-title', styles['folder-upload-modal-skipped-title'])}>{`以下 ${skipped.length} 个文件被跳过：`}</div>
                <ul className={classNames('folder-upload-modal-skipped-list', styles['folder-upload-modal-skipped-list'])}>
                  {skipped.map((s) => (
                    <li key={s.name}>{`${s.name} — ${s.reason}`}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ),
      });
      setCurrent('result');
      return true;
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosErr?.response?.status === 409) {
        Modal.warning({
          title: '存在同名文件夹',
          content:
            axiosErr.response.data?.message || '公共目录下已存在同名文件夹，请手动处理后重试',
        });
      } else {
        Modal.error({
          title: '文件夹上传失败',
          content: axiosErr?.response?.data?.message || '文件夹上传失败',
        });
      }
      return false;
    } finally {
      setUploading(false);
    }
  }, [form]);

  const steps: StepFormItem[] = [
    {
      key: 'select',
      title: '上传文件夹',
      validateFields: ['files'],
      beforeEnter: handleStartUpload,
      content: () => (
        <Spin spinning={uploading} tip="正在上传并导入目录...">
          <Form form={form} layout="vertical">
            <Form.Item name="parentId" label="目标公共文件夹" extra="不选则在公共根目录下创建">
              <FolderTreeSelect publicOnly placeholder="选择公共文件夹（不选则上传到公共根目录）" />
            </Form.Item>

            <Form.Item
              name="files"
              label="选择文件夹"
              rules={[{ required: true, message: '请选择要上传的文件夹' }]}
            >
              <CommonUpload
                variant="panel"
                directory
                multiple
                showFileList={false}
                fileSize={MAX_FILE_SIZE}
                renderTips={() => (
                  <span>
                    选择一个文件夹，将连同其子目录一并上传，单文件最大{' '}
                    {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}M
                    <br />
                    选择后浏览器会弹出「上传到此网站？」的确认提示，点击「上传」即可继续
                  </span>
                )}
              />
            </Form.Item>
          </Form>

          {filtered.length > 0 && (
            <Alert
              type="warning"
              showIcon
              className={classNames('folder-upload-modal-skipped-block', styles['folder-upload-modal-skipped-block'])}
              message={`已自动过滤 ${filtered.length} 个不可上传的文件`}
              description={
                <ul className={classNames('folder-upload-modal-skipped-list-compact', styles['folder-upload-modal-skipped-list-compact'])}>
                  {filtered.map((f) => (
                    <li key={f.path}>{`${f.path} — ${f.reason}`}</li>
                  ))}
                </ul>
              }
            />
          )}

          {treeData.length > 0 && (
            <div className={classNames('folder-upload-modal-preview-tree-box', styles['folder-upload-modal-preview-tree-box'])}>
              <Typography.Text type="secondary" className={classNames('folder-upload-modal-preview-tree-label', styles['folder-upload-modal-preview-tree-label'])}>
                待上传文件（{valid.length}）
              </Typography.Text>
              <Tree treeData={treeData} selectable={false} defaultExpandParent className={classNames('folder-upload-modal-preview-tree', styles['folder-upload-modal-preview-tree'])} />
            </div>
          )}

          <Alert
            type="info"
            showIcon
            className={classNames('folder-upload-modal-skipped-block', styles['folder-upload-modal-skipped-block'])}
            message="导入的文件夹与文件将作为公共内容，并直接通过审核（无需再次提交）。"
          />
          <div className={classNames('folder-upload-modal-hint-row', styles['folder-upload-modal-hint-row'])}>
            <ShieldCheck />
            <span>系统将对每个上传文件进行安全扫描</span>
          </div>
        </Spin>
      ),
    },
    {
      key: 'result',
      title: '导入结果',
      allowBack: false,
      content: () => (
        <Result
          status="success"
          icon={<CircleCheck />}
          title="文件夹上传完成"
          subTitle={
            result
              ? `新建 ${result.created.folders} 个文件夹、${result.created.files} 个文件`
              : undefined
          }
        >
          {result && result.skipped.length > 0 && (
            <div className={classNames('folder-upload-modal-result-left', styles['folder-upload-modal-result-left'])}>
              <Typography.Text type="warning" className={classNames('folder-upload-modal-warning-row', styles['folder-upload-modal-warning-row'])}>
                <CircleAlert /> 以下 {result.skipped.length} 个文件被跳过：
              </Typography.Text>
              <ul className={classNames('folder-upload-modal-result-skipped-list', styles['folder-upload-modal-result-skipped-list'])}>
                {result.skipped.map((s) => (
                  <li key={s.name}>
                    {s.name} — {s.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Result>
      ),
      footer: () => (
        <div className={classNames('folder-upload-modal-footer-actions', styles['folder-upload-modal-footer-actions'])}>
          <Button
            type="primary"
            onClick={() => {
              handleReset();
              onSuccess();
            }}
          >
            完成
          </Button>
        </div>
      ),
    },
  ];

  return (
    <StepForm
      title="上传文件夹"
      form={form}
      open={open}
      current={current}
      onCancel={handleCancel}
      onStepChange={setCurrent}
      steps={steps}
      width={600}
      showSteps
    />
  );
};

export default FolderUploadModal;
