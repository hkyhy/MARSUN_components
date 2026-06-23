import { LAST_ACTIVITY_STORAGE_KEY, SESSION_IDLE_TIMEOUT_MS } from '@/constants/auth';
import { useAuthStore } from '@/stores/authStore';
import { clearLastActivity, getLastActivityTime, touchLastActivity } from '@/utils/sessionActivity';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CHECK_INTERVAL_MS = 60_000;
const ACTIVITY_THROTTLE_MS = 5_000;

const ACTIVITY_LISTENERS: Array<{
  type: string;
  target: EventTarget;
  options?: AddEventListenerOptions;
}> = [
  { type: 'mousedown', target: window },
  { type: 'mousemove', target: window },
  { type: 'keydown', target: window },
  { type: 'touchstart', target: window },
  { type: 'click', target: window },
  { type: 'wheel', target: window, options: { passive: true } },
  { type: 'scroll', target: document, options: { capture: true, passive: true } },
];

/**
 * 登录态下监听用户操作；超过空闲阈值后自动退出并跳转登录页。
 * 跨标签页通过 localStorage 同步最后操作时间与登出状态。
 */
export function useIdleLogout(timeoutMs: number = SESSION_IDLE_TIMEOUT_MS) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const selfTriggeredLogoutRef = useRef(false);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated || window.location.pathname === '/login') {
      return;
    }

    const performIdleLogout = () => {
      selfTriggeredLogoutRef.current = true;
      logout();
      clearLastActivity();
      message.warning('您已长时间未操作，已自动退出登录');
      navigate('/login', { replace: true });
    };

    const checkIdle = () => {
      if (Date.now() - getLastActivityTime() >= timeoutMs) {
        performIdleLogout();
      }
    };

    const scheduleActivityTouch = () => {
      if (throttleTimerRef.current) {
        return;
      }
      throttleTimerRef.current = setTimeout(() => {
        throttleTimerRef.current = null;
        touchLastActivity();
      }, ACTIVITY_THROTTLE_MS);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkIdle();
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'token' && !event.newValue && useAuthStore.getState().isAuthenticated) {
        logout();
        clearLastActivity();
        if (!selfTriggeredLogoutRef.current) {
          navigate('/login', { replace: true });
        }
        return;
      }
      if (event.key === null || event.key === LAST_ACTIVITY_STORAGE_KEY) {
        checkIdle();
      }
    };

    if (!localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY)) {
      touchLastActivity();
    }
    checkIdle();

    ACTIVITY_LISTENERS.forEach(({ type, target, options }) => {
      target.addEventListener(type, scheduleActivityTouch, options);
    });
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('storage', onStorage);

    const intervalId = window.setInterval(checkIdle, CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_LISTENERS.forEach(({ type, target, options }) => {
        target.removeEventListener(type, scheduleActivityTouch, options);
      });
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('storage', onStorage);
      window.clearInterval(intervalId);
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
        throttleTimerRef.current = null;
      }
    };
  }, [isAuthenticated, logout, navigate, timeoutMs]);
}
