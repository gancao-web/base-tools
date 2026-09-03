import { describe, expect, it } from 'vitest';
import { UploadBusinessError, parseUploadResponse } from '../../../src/shared/network/upload';
import { getResponseValue } from '../../../src/shared/network/response';

describe('shared/network/response', () => {
  it('支持字符串路径和候选路径数组', () => {
    const response = {
      data: { list: [{ id: 1 }] },
      fallback: { value: 2 },
    };

    expect(getResponseValue(response, 'data.list[0].id')).toBe(1);
    expect(getResponseValue(response, ['missing.value', 'fallback.value'])).toBe(2);
  });

  it('候选路径跳过 null 和 undefined，并保留有效假值', () => {
    const response = {
      empty: '',
      nil: null,
      disabled: false,
      missing: undefined,
      zero: 0,
      fallback: 'fallback',
    };

    expect(getResponseValue(response, ['nil', 'missing', 'zero', 'fallback'])).toBe(0);
    expect(getResponseValue(response, ['empty', 'fallback'])).toBe('');
    expect(getResponseValue(response, ['disabled', 'fallback'])).toBe(false);
  });

  it('接受只读候选路径，并在没有可用值时返回 undefined', () => {
    const key = ['missing', 'nil'] as const;

    expect(getResponseValue({ nil: null }, key)).toBeUndefined();
    expect(getResponseValue({}, undefined)).toBeUndefined();
  });
});

describe('shared/network/upload response config', () => {
  it('使用 resKey、codeKey 和 successKey 的候选路径解析成功响应', () => {
    const response = {
      code: 'legacy',
      payload: { value: 42 },
      result: null,
      status: 'ok',
    };

    expect(
      parseUploadResponse(response, {
        resKey: ['result', 'payload.value'],
        msgKey: ['error.message', 'message'],
        codeKey: ['meta.code', 'code'],
        successKey: ['meta.success', 'status'],
        successCode: ['ok'] as const,
        reloginCode: ['expired'] as const,
      }),
    ).toBe(42);
  });

  it('使用 msgKey 和 codeKey 的候选路径构造业务错误', () => {
    const response = {
      code: 'expired',
      error: { message: null },
      message: '登录已过期',
    };

    try {
      parseUploadResponse(response, {
        resKey: false,
        msgKey: ['error.message', 'message'],
        codeKey: ['meta.code', 'code'],
        successCode: ['ok'] as const,
        reloginCode: ['expired'] as const,
      });
      throw new Error('预期抛出 UploadBusinessError');
    } catch (error) {
      expect(error).toBeInstanceOf(UploadBusinessError);
      expect(error).toMatchObject({
        code: 'expired',
        message: '登录已过期',
        relogin: true,
        response,
      });
    }
  });
});
