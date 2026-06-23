import { feedbackApi } from '@/api';
import { PersonSelect } from '@/components/Common';
import React, { useCallback } from 'react';

type AssigneeSelectProps = Omit<React.ComponentProps<typeof PersonSelect>, 'loadOptions'>;

/** 反馈负责人选择器（可搜索、展示部门完整路径与联系方式） */
const AssigneeSelect: React.FC<AssigneeSelectProps> = (props) => {
  const loadOptions = useCallback(() => feedbackApi.assigneeOptions(), []);

  return <PersonSelect loadOptions={loadOptions} {...props} />;
};

export default AssigneeSelect;
