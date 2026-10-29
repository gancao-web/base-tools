import { afterEach, describe, expect, it, vi } from 'vitest';
import { createLogSnapshot } from '../../src/shared/network/logSnapshot';
import { writeRequestLog } from '../../src/shared/network/requestLog';

const pdf = (size = 5000) =>
  Buffer.concat([Buffer.from('%PDF-1.7\n'), Buffer.alloc(size)]).toString('base64');

describe('文件载荷日志快照', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('小编码及 4096 边界保留，仅摘要超过阈值的完整 Data URL', () => {
    for (const size of [3, 4096]) {
      const body = 'A'.repeat(size === 3 ? 4 : size);
      const value = `data:image/png;base64,${body}`;
      expect(createLogSnapshot(value)).toBe(value);
    }
    const value = `data:application/pdf;base64,${pdf()}`;
    expect(createLogSnapshot(value)).toContain('type=application/pdf');
    expect(createLogSnapshot(value)).toContain(`encodedLength=${pdf().length}`);
    expect(createLogSnapshot(`data:application/pdf;base64,${pdf(10)}`)).toContain('data:');
  });

  it.each([
    ['image/png', [137, 80, 78, 71, 13, 10, 26, 10]],
    ['image/jpeg', [255, 216, 255]],
    ['image/gif', [...Buffer.from('GIF89a')]],
    ['image/webp', [...Buffer.from('RIFF'), 0, 0, 0, 0, ...Buffer.from('WEBP')]],
    ['application/pdf', [...Buffer.from('%PDF-')]],
    ['application/zip', [80, 75, 3, 4]],
    ['application/gzip', [31, 139, 8]],
  ])('通过文件头识别 %s 的标准和 URL-safe 裸编码', (type, header) => {
    const body = Buffer.concat([Buffer.from(header), Buffer.alloc(5000, 255)]);
    for (const encoding of ['base64', 'base64url'] as const) {
      expect(createLogSnapshot(body.toString(encoding))).toContain(`type=${type}`);
    }
  });

  it('未知编码、非法编码、长正文和完整富文本均原样保留', () => {
    const values = [
      Buffer.from('ordinary business text'.repeat(1000)).toString('base64'),
      `${pdf()}\n`,
      `${pdf()}=`,
      '文章正文'.repeat(10000),
      `<p>正文</p><img src="data:image/png;base64,${pdf()}">`,
      JSON.stringify({ file: pdf() }),
    ];
    for (const value of values) expect(createLogSnapshot(value)).toBe(value);
  });

  it('文件、二进制视图和 FormData 不复制文件正文，重名字段保留', () => {
    const blob = new Blob(['file'], { type: 'text/plain' });
    const file = new File(['file'], 'test.txt', { type: 'text/plain' });
    const form = new FormData();
    form.append('item', 'text');
    form.append('item', file);
    const input = {
      blob,
      file,
      buffer: new ArrayBuffer(8),
      view: new DataView(new ArrayBuffer(4)),
      bytes: new Uint8Array(3),
      form,
    };
    const copy = createLogSnapshot(input);
    expect(copy).toMatchObject({
      blob: '[Blob：size=4, type=text/plain]',
      file: '[File：size=4, type=text/plain, name=test.txt]',
      buffer: '[ArrayBuffer：byteLength=8]',
      view: '[DataView：byteLength=4]',
      bytes: '[Uint8Array：byteLength=3]',
      form: [
        ['item', 'text'],
        ['item', expect.stringContaining('name=test.txt')],
      ],
    });
    expect(input.file).toBe(file);
    expect(input.buffer.byteLength).toBe(8);
  });

  it('流不加锁、不消费，缺少平台类型仍可处理普通数据', () => {
    const stream = new ReadableStream();
    expect(createLogSnapshot(stream)).toBe('[ReadableStream]');
    expect(stream.locked).toBe(false);
    for (const name of [
      'File',
      'Blob',
      'ArrayBuffer',
      'FormData',
      'ReadableStream',
      'WritableStream',
      'TransformStream',
    ])
      vi.stubGlobal(name, undefined);
    expect(createLogSnapshot({ body: pdf() })).toEqual({
      body: expect.stringContaining('application/pdf'),
    });
  });

  it('循环引用、错误原因及读取失败不修改原始对象', () => {
    const input: Record<string, unknown> = { value: pdf(), date: new Date(0) };
    input.self = input;
    input.error = new Error('failed', { cause: { body: pdf() } });
    Object.defineProperty(input, 'broken', {
      enumerable: true,
      get() {
        throw new Error('getter');
      },
    });
    const copy = createLogSnapshot(input);
    expect(copy.self).toBe(copy);
    expect(copy.value).toContain('application/pdf');
    expect(copy.error).toMatchObject({
      message: 'failed',
      cause: { body: expect.stringContaining('application/pdf') },
    });
    expect(copy.broken).toBe('[Unable to read log field]');
    expect(input.value).toBe(pdf());
  });

  it('先读取延迟现场，再快照请求、响应、错误与附加数据，旧开关不抑制日志', () => {
    const log = vi.fn();
    let captured = 0;
    const data = { file: pdf() };
    writeRequestLog(log, {
      config: {
        ...{ showLog: false },
        data,
        logExtra: {
          get endContext() {
            captured++;
            return data;
          },
          extra: data,
        },
      },
      status: 'fail',
      res: data,
      e: new Error('failed', { cause: data }),
    });
    expect(captured).toBe(1);
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][0]).toBe('error');
    for (const key of ['data', 'res', 'extra', 'endContext'])
      expect(log.mock.calls[0][1][key]).toEqual({
        file: expect.stringContaining('application/pdf'),
      });
    expect(log.mock.calls[0][1].e.cause).toEqual({
      file: expect.stringContaining('application/pdf'),
    });
    expect(data.file).toBe(pdf());
    writeRequestLog(undefined, {
      config: {
        logExtra: {
          get endContext() {
            captured++;
            return data;
          },
        },
      },
      status: 'success',
    });
    expect(captured).toBe(1);
  });
});
