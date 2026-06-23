import { describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/Files/download', () => ({
  getFileDownloadUrl: (fileId: string, options?: { preview?: boolean }) => {
    const params = new URLSearchParams();
    params.set('token', 'test-token');
    if (options?.preview) params.set('preview', '1');
    return `/api/files/${fileId}/download?${params.toString()}`;
  },
}));

import { getPreviewType, resolvePreviewUrl } from '../previewUtils';

describe('getPreviewType', () => {
  it('returns video for configured video extensions', () => {
    expect(getPreviewType('.mp4')).toBe('video');
    expect(getPreviewType('.webm')).toBe('video');
    expect(getPreviewType('.mov')).toBe('video');
    expect(getPreviewType('mp4')).toBe('video');
  });

  it('returns unsupported for unknown extensions', () => {
    expect(getPreviewType('.avi')).toBe('unsupported');
    expect(getPreviewType(undefined)).toBe('unsupported');
  });

  it('returns image for image extensions', () => {
    expect(getPreviewType('.png')).toBe('image');
  });
});

describe('resolvePreviewUrl', () => {
  it('adds preview and token for video type', () => {
    const url = resolvePreviewUrl('file-1', 'video');
    expect(url).toContain('preview=1');
    expect(url).toContain('token=');
    expect(url).toContain('/api/files/file-1/download');
  });

  it('adds preview param to custom url for video', () => {
    const url = resolvePreviewUrl('file-1', 'video', '/api/files/file-1/download?token=abc');
    expect(url).toContain('preview=1');
    expect(url).toContain('token=abc');
  });

  it('uses plain download url for image type', () => {
    expect(resolvePreviewUrl('file-1', 'image')).toBe('/api/files/file-1/download');
  });
});
