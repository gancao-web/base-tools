export interface LoadFontFaceOptions {
  /** FontFace 字体描述信息 */
  descriptors?: FontFaceDescriptors;
}

const loadPromiseMap = new Map<string, Promise<FontFace>>();

function getCacheKey(family: string, url: string, descriptors?: FontFaceDescriptors) {
  const descriptorEntries = descriptors
    ? Object.entries(descriptors).sort(([left], [right]) => left.localeCompare(right))
    : [];
  return JSON.stringify([family, url, descriptorEntries]);
}

/**
 * 加载并注册 Web 字体，相同参数的并发调用只会加载一次，失败后可重试。
 * @param family 字体名称
 * @param url 字体文件地址
 * @param options 加载配置
 * @example
 * loadFontFace('SiYuan', 'https://xx/xx.woff2');
 * loadFontFace('SiYuan', 'https://xx/xx.ttf', { descriptors: { weight: '700' } });
 */
export function loadFontFace(family: string, url: string, options: LoadFontFaceOptions = {}) {
  const { descriptors } = options;
  const cacheKey = getCacheKey(family, url, descriptors);
  const cachedPromise = loadPromiseMap.get(cacheKey);
  if (cachedPromise) return cachedPromise;

  const source = `url(${JSON.stringify(url)})`;
  const loadPromise = new FontFace(family, source, descriptors)
    .load()
    .then((fontFace) => {
      (document.fonts as FontFaceSet & { add(font: FontFace): void }).add(fontFace);
      return fontFace;
    })
    .catch((error) => {
      loadPromiseMap.delete(cacheKey);
      throw error;
    });

  loadPromiseMap.set(cacheKey, loadPromise);
  return loadPromise;
}
