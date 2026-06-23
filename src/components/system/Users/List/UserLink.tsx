import React from 'react';
import { useNavigate } from 'react-router-dom';

/** 点击跳转用户详情的链接 */
const UserLink: React.FC<{ userId: string; children: React.ReactNode }> = ({
  userId,
  children,
}) => {
  const navigate = useNavigate();
  return <a onClick={() => navigate(`/system/users/${userId}`)}>{children}</a>;
};

export default UserLink;
