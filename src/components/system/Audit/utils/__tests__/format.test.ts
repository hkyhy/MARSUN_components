import { describe, expect, it } from 'vitest';
import {
  formatIp,
  formatJsonText,
  getAuditActionLabel,
  parseAuditDetail,
} from '../format';

describe('formatIp', () => {
  it('normalizes IPv6 localhost', () => {
    expect(formatIp('::1')).toBe('127.0.0.1');
    expect(formatIp('::ffff:127.0.0.1')).toBe('127.0.0.1');
  });

  it('strips IPv4-mapped prefix', () => {
    expect(formatIp('::ffff:192.168.1.1')).toBe('192.168.1.1');
  });

  it('returns dash for empty value', () => {
    expect(formatIp('')).toBe('-');
    expect(formatIp(null)).toBe('-');
  });
});

describe('getAuditActionLabel', () => {
  it('returns Chinese label for known action', () => {
    expect(getAuditActionLabel('upload_file')).toBe('上传文件');
  });

  it('falls back to raw action', () => {
    expect(getAuditActionLabel('unknown_action')).toBe('unknown_action');
  });
});

describe('parseAuditDetail', () => {
  it('parses valid JSON detail', () => {
    const detail = JSON.stringify({
      method: 'POST',
      path: '/upload',
      body: { name: 'test.pdf' },
      query: {},
    });
    expect(parseAuditDetail(detail)).toEqual({
      method: 'POST',
      path: '/upload',
      body: { name: 'test.pdf' },
      query: {},
    });
  });

  it('returns null for invalid JSON', () => {
    expect(parseAuditDetail('not-json')).toBeNull();
  });
});

describe('formatJsonText', () => {
  it('pretty prints objects', () => {
    expect(formatJsonText({ a: 1 })).toBe('{\n  "a": 1\n}');
  });
});
