import { hasPermission } from '@/components/Common/Auth';
import {
  handleCancelTask,
  handleDeleteTask,
  handleRerunTask,
} from '@/components/TaskManagement/Action/handlers';
import { useAuthStore } from '@/stores/authStore';
import type { AssessmentTaskItem } from '@/types';
import ButtonGroup from '@kne/button-group';
import React from 'react';

interface TaskActionButtonsProps {
  record: AssessmentTaskItem;
  onViewDetail: (record: AssessmentTaskItem) => void;
  onRefresh: () => void;
}

/** 任务列表行操作按钮组 */
const TaskActionButtons: React.FC<TaskActionButtonsProps> = ({
  record,
  onViewDetail,
  onRefresh,
}) => {
  const { user } = useAuthStore();

  const listArray: Record<string, unknown>[] = [
    {
      type: 'link',
      children: '详情',
      onClick: () => onViewDetail(record),
    },
    {
      type: 'link',
      children: '重新运行',
      hidden:
        !hasPermission(user, 'system:task:rerun') ||
        record.status === 'RUNNING' ||
        record.status === 'PENDING',
      onClick: () => handleRerunTask(record, onRefresh),
    },
    {
      type: 'link',
      children: '取消',
      hidden:
        !hasPermission(user, 'system:task:edit') || record.status !== 'PENDING',
      onClick: () => handleCancelTask(record, onRefresh),
    },
    {
      type: 'link',
      children: '删除',
      hidden:
        !hasPermission(user, 'system:task:delete') || record.status === 'RUNNING',
      isDelete: true,
      message: '确定删除该任务？',
      onClick: () => handleDeleteTask(record, onRefresh),
    },
  ];

  return <ButtonGroup moreType="link" list={listArray} />;
};

export default TaskActionButtons;
