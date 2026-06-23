import { CircleHelp } from '@/icons';
import type { TourProps } from 'antd';
import { Button, Tour } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { buildTourAccessContext, getTourCompletedKey } from '../tourAccess';
import { getVisibleTourSteps, type TourRefKey } from '../tourSteps';
import { getMenuTourTarget } from '../tourTargets';
import styles from './style.module.scss';
import classNames from 'classnames';

export interface AppTourRefs {
  quickUpload: React.RefObject<HTMLElement | null>;
  userMenu: React.RefObject<HTMLElement | null>;
  content: React.RefObject<HTMLElement | null>;
}

export interface AppTourProps {
  /** 各步骤的目标元素 ref（菜单模块通过 data-tour-menu 锚点定位） */
  refs: AppTourRefs;
}

const resolveStepTarget = (
  refs: AppTourRefs,
  step: ReturnType<typeof getVisibleTourSteps>[number],
): (() => HTMLElement) | undefined => {
  if (step.menuKey) {
    return () => getMenuTourTarget(step.menuKey!)!;
  }
  if (step.refKey) {
    return () => refs[step.refKey as TourRefKey].current!;
  }
  return undefined;
};

const buildTourSteps = (
  refs: AppTourRefs,
  access: ReturnType<typeof buildTourAccessContext>,
): TourProps['steps'] =>
  getVisibleTourSteps(access).map((step) => ({
    title: step.title,
    description: step.getDescription(access),
    placement: step.placement,
    target: resolveStepTarget(refs, step),
  }));

const AppTour: React.FC<AppTourProps> = ({ refs }) => {
  const { user, hasAnyRole, hasPermissionKey } = useAuthStore();
  const [open, setOpen] = useState(false);

  const access = useMemo(() => {
    if (!user) return null;
    return buildTourAccessContext(user, hasAnyRole, hasPermissionKey);
  }, [user, hasAnyRole, hasPermissionKey]);

  const tourSteps = useMemo(() => (access ? buildTourSteps(refs, access) : []), [refs, access]);

  useEffect(() => {
    if (!user || !access) return;
    const completed = localStorage.getItem(getTourCompletedKey(user.id, user.role));
    if (!completed) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user, access]);

  const handleClose = () => {
    setOpen(false);
    if (user) {
      localStorage.setItem(getTourCompletedKey(user.id, user.role), 'true');
    }
  };

  if (!access) {
    return null;
  }

  return (
    <>
      <Button
        type="text"
        icon={<CircleHelp />}
        onClick={() => setOpen(true)}
        title="系统导览"
      />
      <Tour
        open={open}
        onClose={handleClose}
        onFinish={handleClose}
        steps={tourSteps}
        indicatorsRender={(current, total) => (
          <span className={classNames('app-tour-root', styles['app-tour-root'])}>
            {current + 1} / {total}
          </span>
        )}
      />
    </>
  );
};

export default AppTour;
