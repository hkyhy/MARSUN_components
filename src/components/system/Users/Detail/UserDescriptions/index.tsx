import { CommonDescriptions, type DescriptionItem } from '@/components/Common/Descriptions';
import { MemberStatusTag, RoleTag } from '@/components/Common/Tag';
import type { UserInfo } from '@/types';
import { MemberStatus } from '@/types';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface UserDescriptionsProps {
  user: UserInfo;
  bordered?: boolean;
  column?: number;
  size?: 'small' | 'default';
}

/** 用户详情 Descriptions 展示 */
const UserDescriptions: React.FC<UserDescriptionsProps> = ({
  user,
  bordered = true,
  column = 2,
  size = 'default',
}) => {
  const basicItems: DescriptionItem[] = [
    { label: '姓名', value: user.displayName },
    { label: '工号', value: user.employeeId },
    { label: '邮箱', value: user.email || '-' },
    { label: '电话', value: user.phone || '-' },
    { label: '部门', value: user.departmentName || '-' },
    {
      label: '角色',
      value: <RoleTag role={user.role} roleName={user.roleName} />,
    },
    {
      label: '状态',
      value: <MemberStatusTag status={user.memberStatus} />,
    },
    {
      label: '创建时间',
      value: user.createdAt ? new Date(user.createdAt).toLocaleString('zh-CN') : '-',
    },
  ];

  const resignedItems: DescriptionItem[] = [
    {
      label: '离职日期',
      value: user.resignedAt ? new Date(user.resignedAt).toLocaleDateString('zh-CN') : '-',
    },
    { label: '离职备注', value: user.statusRemark || '-' },
    {
      label: '离职附件',
      value: user.resignedAttachment ? (
        <a href={user.resignedAttachment} target="_blank" rel="noreferrer">
          查看附件
        </a>
      ) : (
        '无'
      ),
    },
  ];

  const remarkItems: DescriptionItem[] = [{ label: '备注', value: user.statusRemark || '-' }];

  return (
    <>
      <CommonDescriptions content={basicItems} bordered={bordered} column={column} size={size} />

      {user.memberStatus === MemberStatus.RESIGNED && (
        <div className={classNames('user-descriptions-card', styles['user-descriptions-card'])}>
          <h4 className={classNames('user-descriptions-item', styles['user-descriptions-item'])}>离职信息</h4>
          <CommonDescriptions content={resignedItems} column={3} size="small" bordered />
        </div>
      )}

      {user.statusRemark && user.memberStatus !== MemberStatus.RESIGNED && (
        <div className={classNames('user-descriptions-card', styles['user-descriptions-card'])}>
          <h4 className={classNames('user-descriptions-item', styles['user-descriptions-item'])}>
            {user.memberStatus === MemberStatus.DELETED ? '删除信息' : '状态备注'}
          </h4>
          <CommonDescriptions content={remarkItems} column={1} size="small" bordered />
        </div>
      )}
    </>
  );
};

export default UserDescriptions;
