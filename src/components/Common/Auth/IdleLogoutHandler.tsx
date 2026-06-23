import { useIdleLogout } from '@/hooks/useIdleLogout';

/** 全局挂载：登录态空闲超时自动退出 */
const IdleLogoutHandler: React.FC = () => {
  useIdleLogout();
  return null;
};

export default IdleLogoutHandler;
