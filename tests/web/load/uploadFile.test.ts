import { afterEach, describe, expect, it, vi } from 'vitest';
import { uploadFile } from '../../../src/web';

describe('web/uploadFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('字符串化额外参数并忽略 null 和 undefined', async () => {
    const entries: Array<[string, unknown]> = [];

    class MockFormData {
      append(name: string, value: unknown) {
        entries.push([name, value]);
      }
    }

    class MockXMLHttpRequest {
      upload = { onprogress: null };
      status = 200;
      responseText = 'ok';
      timeout = 0;
      onload?: () => void;

      open() {}

      setRequestHeader() {}

      send() {
        this.onload?.();
      }

      abort() {}
    }

    vi.stubGlobal('FormData', MockFormData);
    vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);

    const file = new File(['content'], 'test.txt');
    const result = await uploadFile(
      {
        url: '/upload',
        file,
        data: {
          text: 'value',
          count: 1,
          enabled: true,
          empty: null,
          missing: undefined,
          json: JSON.stringify({ id: 1 }),
        },
      },
      { showLog: false, toastError: false },
    );

    expect(result).toBe('ok');
    expect(entries).toEqual([
      ['text', 'value'],
      ['count', '1'],
      ['enabled', 'true'],
      ['json', '{"id":1}'],
      ['file', file],
    ]);
  });
});
