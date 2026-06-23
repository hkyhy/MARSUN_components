import { CommonDescriptions } from '@/components/Common';
import type { DescriptionItem } from '@/components/Common';
import { SEMANTIC_COLORS, SemanticTag } from '@/components/Common';
import type { AuditLogItem } from '@/types';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';
import {
  formatIp,
  formatJsonText,
  getAuditActionLabel,
  getAuditTargetTypeLabel,
  parseAuditDetail,
} from '../../utils';

interface DetailModalProps {
  open: boolean;
  record: AuditLogItem | null;
  onCancel: () => void;
}

function buildDetailItems(detail: string): DescriptionItem[] {
  const parsed = parseAuditDetail(detail);
  if (!parsed) {
    return [{ label: '原始内容', value: detail || '-', span: 2 }];
  }

  const items: DescriptionItem[] = [];
  if (parsed.method) items.push({ label: '请求方法', value: parsed.method });
  if (parsed.path) items.push({ label: '请求路径', value: parsed.path });

  if (parsed.body && Object.keys(parsed.body).length > 0) {
    items.push({
      label: '请求体',
      value: (
        <pre className={classNames('detail-modal-json-pre', styles['detail-modal-json-pre'])}>{formatJsonText(parsed.body)}</pre>
      ),
      span: 2,
    });
  }

  if (parsed.query && Object.keys(parsed.query).length > 0) {
    items.push({
      label: '查询参数',
      value: (
        <pre className={classNames('detail-modal-json-pre', styles['detail-modal-json-pre'])}>{formatJsonText(parsed.query)}</pre>
      ),
      span: 2,
    });
  }

  return items.length > 0 ? items : [{ label: '原始内容', value: detail || '-', span: 2 }];
}

/** 审计日志详情弹窗 */
const DetailModal: React.FC<DetailModalProps> = ({ open, record, onCancel }) => {
  const baseItems = useMemo<DescriptionItem[]>(() => {
    if (!record) return [];
    return [
      { label: '操作时间', value: dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') },
      { label: '操作人', value: record.operatorName },
      {
        label: '操作',
        value: (
          <SemanticTag color={SEMANTIC_COLORS.INFO}>{getAuditActionLabel(record.action)}</SemanticTag>
        ),
      },
      { label: '对象类型', value: getAuditTargetTypeLabel(record.targetType) },
      { label: '对象ID', value: record.targetId },
      { label: 'IP', value: formatIp(record.ip) },
    ];
  }, [record]);

  const detailItems = useMemo(
    () => (record?.detail ? buildDetailItems(record.detail) : []),
    [record?.detail],
  );

  if (!record) return null;

  return (
    <Modal title="操作详情" open={open} onCancel={onCancel} footer={null} width={720} destroyOnClose>
      <CommonDescriptions content={baseItems} column={2} />
      {detailItems.length > 0 && (
        <div className={classNames('detail-modal-detail-section', styles['detail-modal-detail-section'])}>
          <div className={classNames('detail-modal-detail-section-title', styles['detail-modal-detail-section-title'])}>请求详情</div>
          <CommonDescriptions content={detailItems} column={2} />
        </div>
      )}
    </Modal>
  );
};

export default DetailModal;
