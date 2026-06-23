import { authApi } from '@/api';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { UserInfo } from '@/types';
import { fetchAuthPermissions } from '@/utils/fetchAuthPermissions';
import request from '@/utils/request';
import { Form, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type AuthView = 'login' | 'forgot';

const useLogin = () => {
  const navigate = useNavigate();
  const { login, setUserRolePermissions, setPermissionDefinitions } = useAuthStore();
  const { settings } = useSettingsStore();

  const [loginForm] = Form.useForm();
  const [forgotForm] = Form.useForm();
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [view, setView] = useState<AuthView>('login');

  const handleLogin = async (values: { employeeId: string; password: string }) => {
    setLoginLoading(true);
    try {
      const res = await request.post<{ code: number; data: { token: string; user: UserInfo } }>(
        '/auth/login',
        values,
        { headers: { 'X-Skip-Error-Handler': 'true' } },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = (res as any).data || res;
      const { token, user } = responseData;
      login(token, user);
      const { userRolePermissions, permissionDefinitions } = await fetchAuthPermissions();
      setUserRolePermissions(userRolePermissions);
      setPermissionDefinitions(permissionDefinitions);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '登录失败';
      message.error(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async (values: {
    employeeId: string;
    displayName: string;
    newPassword: string;
  }) => {
    setForgotLoading(true);
    try {
      await authApi.forgotPassword(values);
      message.success('密码重置成功，请使用新密码登录');
      setView('login');
      forgotForm.resetFields();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '密码重置失败';
      message.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const switchToForgot = () => setView('forgot');
  const switchToLogin = () => {
    setView('login');
    forgotForm.resetFields();
  };

  const bgStyle: React.CSSProperties = settings.loginBg
    ? {
        backgroundImage: `url(${settings.loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return {
    settings,
    loginForm,
    forgotForm,
    loginLoading,
    forgotLoading,
    view,
    bgStyle,
    handleLogin,
    handleForgotPassword,
    switchToForgot,
    switchToLogin,
  };
};

export default useLogin;
