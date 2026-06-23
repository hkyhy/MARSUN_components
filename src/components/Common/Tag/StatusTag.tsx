import { MEMBER_STATUS_MAP, REVIEW_STATUS_MAP } from '@/constants';
import { getRoleLabel } from '@/stores/roleOptionsStore';
import React from 'react';
import SemanticTag from './SemanticTag';

/** 成员状态 Tag */
export const MemberStatusTag: React.FC<{ status: string }> = ({ status }) => {
  const map = MEMBER_STATUS_MAP[status];
  return map ? (
    <SemanticTag color={map.color}>{map.label}</SemanticTag>
  ) : (
    <SemanticTag>{status}</SemanticTag>
  );
};

/** 角色 Tag */
export const RoleTag: React.FC<{ role: string; roleName?: string }> = ({ role, roleName }) => {
  return <SemanticTag>{roleName || getRoleLabel(role)}</SemanticTag>;
};

/** 审核状态 Tag */
export const ReviewStatusTag: React.FC<{ status: string }> = ({ status }) => {
  const map = REVIEW_STATUS_MAP[status];
  return map ? (
    <SemanticTag color={map.color}>{map.label}</SemanticTag>
  ) : (
    <SemanticTag>{status}</SemanticTag>
  );
};
