import { useAuthStore } from '@/stores/authStore';

function getAuthToken(): string | null {
  return useAuthStore.getState().token || localStorage.getItem('token');
}

/** 带鉴权参数的文件下载 URL（用于新窗口打开、iframe 等场景） */
export function getFileDownloadUrl(
  fileId: string,
  options?: { preview?: boolean; token?: string | null },
): string {
  const token = options?.token === undefined ? getAuthToken() : options.token;
  const params = new URLSearchParams();
  if (token) params.set('token', token);
  if (options?.preview) params.set('preview', '1');
  const qs = params.toString();
  return `/api/files/${fileId}/download${qs ? `?${qs}` : ''}`;
}

export function getFileDownloadAuthHeaders(): HeadersInit | undefined {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

/** 通过 fetch 鉴权后触发浏览器下载 */
export async function downloadFileItem(file: { id: string; name: string }): Promise<boolean> {
  try {
    const res = await fetch(`/api/files/${file.id}/download`, {
      headers: getFileDownloadAuthHeaders(),
    });
    if (!res.ok) return false;

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
    return true;
  } catch {
    return false;
  }
}
