import { permissionApi } from '@/api';
import { PersonSelect } from '@/components/Common';
import React, { useCallback } from 'react';

type ReviewerSelectProps = Omit<React.ComponentProps<typeof PersonSelect>, 'loadOptions'>;

/** 审核人选择器（可搜索、展示部门完整路径与联系方式） */
const ReviewerSelect: React.FC<ReviewerSelectProps> = (props) => {
  const loadOptions = useCallback(() => permissionApi.reviewers(), []);

  return <PersonSelect loadOptions={loadOptions} {...props} />;
};

export default ReviewerSelect;
