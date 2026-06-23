import { userApi } from '@/api';
import React, { useCallback } from 'react';
import PersonSelect from './PersonSelect';

interface UploaderSelectProps extends Omit<
  React.ComponentProps<typeof PersonSelect>,
  'loadOptions'
> {}

/** 提交人选择器，自动加载可选的提交人列表 */
const UploaderSelect: React.FC<UploaderSelectProps> = (props) => {
  const loadOptions = useCallback(() => userApi.uploaders(), []);

  return (
    <PersonSelect
      placeholder="提交人"
      allowClear
      loadOptions={loadOptions}
      style={{ width: 180 }}
      {...props}
    />
  );
};

export default UploaderSelect;
