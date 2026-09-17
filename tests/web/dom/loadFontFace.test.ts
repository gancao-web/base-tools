import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadFontFace } from '../../../src/web';

function mockFontApi() {
  const fontFace = { family: 'SiYuan' } as FontFace;
  const load = vi.fn().mockResolvedValue(fontFace);
  const FontFaceMock = vi.fn().mockImplementation(() => ({ load }));
  const add = vi.fn();

  vi.stubGlobal('FontFace', FontFaceMock);
  vi.stubGlobal('document', { fonts: { add } });

  return { fontFace, load, FontFaceMock, add };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('loadFontFace', () => {
  it('加载、注册字体并复用相同请求', async () => {
    const { fontFace, load, FontFaceMock, add } = mockFontApi();
    const options = { descriptors: { weight: '700' } } as const;

    const firstPromise = loadFontFace('SiYuan', 'https://example.com/a.woff2', options);
    const secondPromise = loadFontFace('SiYuan', 'https://example.com/a.woff2', options);

    expect(secondPromise).toBe(firstPromise);
    await expect(firstPromise).resolves.toBe(fontFace);
    expect(FontFaceMock).toHaveBeenCalledWith(
      'SiYuan',
      'url("https://example.com/a.woff2")',
      options.descriptors,
    );
    expect(load).toHaveBeenCalledOnce();
    expect(add).toHaveBeenCalledWith(fontFace);
  });
});
