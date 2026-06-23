import { useAuthStore } from '@/stores/authStore';
import type { ApiResponse } from '@/types';
import { message } from 'antd';
import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse;
    if (data.code !== 0) {
      // 业务错误：统一提示（可通过 headers 中 X-Skip-Error-Handler 跳过）
      if (!(response.config.headers as Record<string, string>)?.['X-Skip-Error-Handler']) {
        message.error(data.message || '请求失败');
      }
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    return response.data;
  },
  (error) => {
    const isPublicEndpoint =
      error.config?.url?.includes('/auth/') || error.config?.url?.includes('/departments/');
    const skipHandler = (error.config?.headers as Record<string, string>)?.['X-Skip-Error-Handler'];
    const isOnLoginPage = window.location.pathname === '/login';

    if (error.response?.status === 401) {
      // 公开接口（登录/注册/部门下拉）或已在登录页时，不跳转不弹错误
      if (!isPublicEndpoint && !isOnLoginPage) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    } else {
      // 其他错误：统一提示（可通过 X-Skip-Error-Handler 跳过）
      if (!skipHandler) {
        const msg = error.response?.data?.message || error.message || '请求失败';
        message.error(msg);
      }
    }
    const msg = error.response?.data?.message || error.message || '请求失败';
    return Promise.reject(new Error(msg));
  },
);

export default request;
