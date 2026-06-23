import { Plus } from '@/icons';
import { Button } from 'antd';
import React from 'react';

export interface CreateButtonProps {
  onClick?: () => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({ onClick }) => (
  <Button type="primary" icon={<Plus />} onClick={onClick}>
    新建知识库
  </Button>
);

export default CreateButton;
