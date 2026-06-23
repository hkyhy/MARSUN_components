import { fileApi } from '@/api';
import type { StepFormItem } from '@/components/Common';
import { StepForm } from '@/components/Common';
import type { FileListItem } from '@/components/Common/File/FileList';
import FileList from '@/components/Common/File/FileList';
import { UploadForm } from '@/components/Files/Form';
import { CircleCheck, CircleX, Loader2, ShieldCheck } from '@/icons';
import type { ReviewStatus } from '@/types';
import { Button, Empty, Form, message, Spin } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import axios from 'axios';
import classNames from 'classnames';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import styles from './style.module.scss';

interface UploadModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 单文件上传结果 */
interface FileUploadResult {
  uid: string;
  name: string;
  status: 'uploading' | 'success' | 'fail';
  id?: string;
  errorMsg?: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState('select');
  const [fileResults, setFileResults] = useState<FileUploadResult[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 记录上传过程中被删除的文件 uid，避免循环里把它们重新写回
  const deletedUidsRef = useRef<Set<string>>(new Set());
  // 每个文件的请求中止控制器，删除时可取消正在进行的上传
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const successIds = fileResults.filter((r) => r.status === 'success' && r.id).map((r) => r.id!);
  const allDone =
    !uploading && fileResults.length > 0 && fileResults.every((r) => r.status !== 'uploading');

  const handleDelete = useCallback((uid: string) => {
    deletedUidsRef.current.add(uid);
    abortControllersRef.current.get(uid)?.abort();
    abortControllersRef.current.delete(uid);
    setFileResults((prev) => prev.filter((r) => (r.id || r.uid) !== uid));
  }, []);

  const handleReset = useCallback(() => {
    abortControllersRef.current.forEach((c) => c.abort());
    abortControllersRef.current = new Map();
    deletedUidsRef.current = new Set();
    form.resetFields();
    setFileResults([]);
    setCurrent('select');
    setUploading(false);
  }, [form]);

  const handleCancel = useCallback(() => {
    handleReset();
    onCancel();
  }, [handleReset, onCancel]);

  const handleStartUpload = useCallback(
    async (values: Record<string, unknown>) => {
      const fileList = (values.files as UploadFile[]) || [];
      if (!fileList.length) return false;

      deletedUidsRef.current = new Set();
      abortControllersRef.current = new Map();

      const results: FileUploadResult[] = fileList.map((f) => ({
        uid: f.uid,
        name: f.name,
        status: 'uploading' as const,
      }));
      setFileResults(results);
      setUploading(true);

      const commitResult = (uid: string, next: FileUploadResult) => {
        setFileResults((prev) =>
          prev.some((r) => r.uid === uid) ? prev.map((r) => (r.uid === uid ? next : r)) : prev,
        );
      };

      (async () => {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i]!;
          const prev = results[i]!;
          // 文件在轮到它上传前已被删除，直接跳过
          if (deletedUidsRef.current.has(prev.uid)) continue;

          const formData = new FormData();
          formData.append('file', file.originFileObj as File);
          formData.append('fileScope', 'DEPARTMENT');
          const parentId = form.getFieldValue('parentId') as string | undefined;
          if (parentId) formData.append('parentId', parentId);
          if (fileList.length === 1) {
            const nameValue = form.getFieldValue('name');
            if (nameValue) formData.append('name', nameValue as string);
          }

          const controller = new AbortController();
          abortControllersRef.current.set(prev.uid, controller);
          try {
            const res = (await fileApi.upload(formData, {
              signal: controller.signal,
            })) as unknown as {
              data: { id: string };
            };
            commitResult(prev.uid, {
              uid: prev.uid,
              name: prev.name,
              status: 'success',
              id: res.data.id,
            });
          } catch (err: unknown) {
            // 用户删除该文件导致请求被中止，不作为失败处理
            if (axios.isCancel(err) || deletedUidsRef.current.has(prev.uid)) {
              continue;
            }
            let errorMsg = '上传失败';
            const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
            if (axiosErr?.response?.status === 422) {
              errorMsg = axiosErr.response.data?.message || '文件安全扫描未通过';
            }
            commitResult(prev.uid, { uid: prev.uid, name: prev.name, status: 'fail', errorMsg });
            if (axiosErr?.response?.status === 422) {
              message.error(errorMsg);
            }
          } finally {
            abortControllersRef.current.delete(prev.uid);
          }
        }
        setUploading(false);
      })();

      return true;
    },
    [form],
  );

  const handleSubmitReview = useCallback(async () => {
    if (!successIds.length) return;
    setSubmitting(true);
    try {
      await fileApi.batchSubmitReview(successIds);
      message.success(`${successIds.length} 个文件已提交审核`);
      handleReset();
      onSuccess();
    } catch {
      // handled
    } finally {
      setSubmitting(false);
    }
  }, [successIds, handleReset, onSuccess]);

  const fileItems: FileListItem[] = useMemo(
    () =>
      fileResults.map((r) => {
        const ext = r.name.includes('.') ? `.${r.name.split('.').pop()?.toLowerCase()}` : undefined;
        return {
          file: {
            id: r.id || r.uid,
            name: r.name,
            type: 'FILE' as const,
            extension: ext,
            parentId: '',
            departmentId: '',
            uploaderId: '',
            uploaderName: '',
            reviewStatus: 'DRAFT' as ReviewStatus,
            version: 1,
            createdAt: '',
            updatedAt: '',
          },
          status:
            r.status === 'uploading' ? (
              <span
                className={classNames(
                  'upload-modal-upload-status-uploading',
                  styles['upload-modal-upload-status-uploading'],
                )}
              >
                <Spin indicator={<Loader2 />} size="small" /> 上传中
              </span>
            ) : r.status === 'success' ? (
              <span
                className={classNames(
                  'upload-modal-upload-status-success',
                  styles['upload-modal-upload-status-success'],
                )}
              >
                <CircleCheck /> 上传成功
              </span>
            ) : (
              <span
                className={classNames(
                  'upload-modal-upload-status-fail',
                  styles['upload-modal-upload-status-fail'],
                )}
                title={r.errorMsg}
              >
                <CircleX /> {r.errorMsg || '上传失败'}
              </span>
            ),
        };
      }),
    [fileResults],
  );

  const steps: StepFormItem[] = [
    {
      key: 'select',
      title: '选择文件',
      validateFields: ['files'],
      beforeEnter: handleStartUpload,
      content: () => (
        <>
          <UploadForm form={form} />
          <div className={classNames('upload-modal-hint-row', styles['upload-modal-hint-row'])}>
            <ShieldCheck />
            <span>系统将对上传文件进行安全扫描；上传后将异步进行 AI 质量评估（含自动标签）</span>
          </div>
        </>
      ),
    },
    {
      key: 'upload',
      title: '上传文件',
      allowBack: false,
      content: () =>
        fileResults.length === 0 ? (
          <Empty description="文件已全部删除">
            <Button type="primary" onClick={handleReset}>
              重新上传
            </Button>
          </Empty>
        ) : (
          <FileList items={fileItems} showDelete onDelete={(f) => handleDelete(f.id)} />
        ),
      footer: () => (
        <div
          className={classNames(
            'upload-modal-footer-actions',
            styles['upload-modal-footer-actions'],
          )}
        >
          <Button onClick={handleCancel}>取消</Button>
          <Button
            type="primary"
            loading={submitting}
            disabled={!allDone || !successIds.length}
            onClick={handleSubmitReview}
          >
            提交审核
          </Button>
        </div>
      ),
    },
  ];

  return (
    <StepForm
      title="上传文件"
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

export default UploadModal;
