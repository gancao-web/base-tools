import { afterEach, describe, expect, it, vi } from 'vitest';
import { setBaseToolsConfig } from '../../src/web';
import { enhanceWebApi } from '../../src/web/async';
import { enhanceUniApi, setBaseToolsConfig as setUniConfig } from '../../src/uni';
import { createUniConfig } from '../helpers/uniConfig';

const fileBody = Buffer.from(`%PDF-${'a'.repeat(5000)}`).toString('base64');
const file = `data:application/pdf;base64,${fileBody}`;
const fileSummary = `[base64：type=application/pdf, encodedLength=${fileBody.length}]`;

describe('异步操作统一日志', () => {
  afterEach(() => {
    setBaseToolsConfig({ log: undefined });
    setUniConfig(createUniConfig());
    vi.unstubAllGlobals();
  });

  it('Web 成功和失败均使用快照且日志异常不影响结果', async () => {
    const log = vi.fn();
    setBaseToolsConfig({ log });
    const api = vi.fn(async (_option: unknown, _config?: Record<string, unknown>) => ({ file }));
    const enhanced = enhanceWebApi(api, 'upload');
    const input = { file };
    await expect(enhanced(input)).resolves.toEqual({ file });
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][1]).toMatchObject({
      option: { file: fileSummary },
      res: { file: fileSummary },
    });
    expect(input.file).toBe(file);
    log.mockImplementation(() => {
      throw new Error('logger');
    });
    await expect(enhanced(input)).resolves.toEqual({ file });
    const error = new Error('network', { cause: { file } });
    const failing = enhanceWebApi(async () => {
      throw error;
    });
    await expect(failing({}, { toastError: false })).rejects.toBe(error);
    expect(log.mock.calls.at(-1)?.[0]).toBe('error');
    expect(log.mock.calls.at(-1)?.[1].e.cause.file).toBe(fileSummary);
  });

  it('Uni 成功和失败均使用快照且日志拒绝不影响结果', async () => {
    const log = vi.fn().mockRejectedValue(new Error('logger'));
    setUniConfig(createUniConfig({ log }));
    const api = vi.fn((option: { success?: (res: { file: string }) => void }) => {
      option.success?.({ file });
    });
    const enhanced = enhanceUniApi(api, 'download');
    await expect(enhanced({}, { toastError: false })).resolves.toEqual({ file });
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][1].res.file).toBe(fileSummary);
    const error = { file };
    const failing = enhanceUniApi((option: { fail?: (err: unknown) => void }) =>
      option.fail?.(error),
    );
    await expect(failing(undefined, { toastError: false })).rejects.toBe(error);
    expect(log.mock.calls[1][0]).toBe('error');
    expect(log.mock.calls[1][1].e.file).toBe(fileSummary);
  });
});
