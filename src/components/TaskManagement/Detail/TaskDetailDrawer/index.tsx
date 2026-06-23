import AiAssessmentPanel from '@/components/Files/Detail/AiAssessmentPanel';
import {
  ASSESSMENT_TASK_STATUS_LABEL,
} from '@/components/TaskManagement/constants/status';
import { SEMANTIC_COLORS, SemanticTag } from '@/components/Common';
import type { AssessmentTaskItem, AssessmentTaskStatus } from '@/types';
import { Descriptions, Drawer } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

const STATUS_COLOR: Record<
  AssessmentTaskStatus,
  (typeof SEMANTIC_COLORS)[keyof typeof SEMANTIC_COLORS]
> = {
  PENDING: SEMANTIC_COLORS.DEFAULT,
  RUNNING: SEMANTIC_COLORS.INFO,
  COMPLETED: SEMANTIC_COLORS.SUCCESS,
  FAILED: SEMANTIC_COLORS.DANGER,
  CANCELLED: SEMANTIC_COLORS.WARNING,
};

interface TaskDetailDrawerProps {
  task: AssessmentTaskItem | null;
  open: boolean;
  onClose: () => void;
}

const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ task, open, onClose }) => {
  if (!task) return null;

  return (
    <Drawer title="任务详情" width={560} open={open} onClose={onClose} destroyOnClose>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="任务 ID">{task.id}</Descriptions.Item>
        <Descriptions.Item label="文件 ID">{task.fileId}</Descriptions.Item>
        <Descriptions.Item label="文件名">{task.fileName}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <SemanticTag color={STATUS_COLOR[task.status]}>
            {ASSESSMENT_TASK_STATUS_LABEL[task.status]}
          </SemanticTag>
        </Descriptions.Item>
        <Descriptions.Item label="触发人">{task.triggererName ?? '-'}</Descriptions.Item>
        <Descriptions.Item label="重试次数">{task.retryCount}</Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {dayjs(task.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="开始时间">
          {task.startedAt ? dayjs(task.startedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="完成时间">
          {task.finishedAt ? dayjs(task.finishedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Descriptions.Item>
        {task.errorMsg && (
          <Descriptions.Item label="错误信息">{task.errorMsg}</Descriptions.Item>
        )}
      </Descriptions>

      {task.result && (
        <div className={classNames('task-detail-drawer-assessment-panel', styles['task-detail-drawer-assessment-panel'])}>
          <AiAssessmentPanel assessment={task.result} />
        </div>
      )}
    </Drawer>
  );
};

export default TaskDetailDrawer;
