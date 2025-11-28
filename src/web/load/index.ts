import type { AxiosResponse } from 'axios';

/**
 * 下载文件
 * @param url 完整的下载地址 | base64字符串 | Blob对象
 * @param fileName 自定义文件名（需含后缀）
 * @example
 * download('https://xx/xx.pdf');
 * download('https://xx/xx.pdf', 'xx.pdf');
 * download(blob, '图片.jpg');
 */
export async function download(url: string | Blob, fileName = '') {
  if (!url) return;

  let blobUrl = '';
  let needRevoke = false; // createObjectURL必须revoke，否则内存泄露，刷新页面都不释放
  try {
    if (url instanceof Blob) {
      // Blob对象
      blobUrl = URL.createObjectURL(url);
      needRevoke = true;
    } else if (url.includes(';base64,')) {
      // base64字符串
      blobUrl = url;
    } else {
      if (fileName) {
        // 自定义文件名：跨域的url无法自定义文件名,此处统一转为blob
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch error ${res.status}：${url}`); // 拦截错误页（404/500 等 HTML）
        const blob = await res.blob();
        blobUrl = URL.createObjectURL(blob);
        needRevoke = true;
      } else {
        // 非自定义文件名的普通链接
        blobUrl = url;
      }
    }

    // window.location.href = fileUrl // 可能会关闭当前页面
    // window.open(fileUrl, '_blank') // 不支持下载图片
    // 通过a标签模拟点击下载
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName; // 若为空字符串,则会自动取url的文件名（跨域url无法自定义文件名,需转为blob）
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    if (needRevoke) {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100); // Safari 需要延迟 revoke
    }
  }
}

/**
 * 解析Axios返回的Blob数据
 * @param res Axios响应对象 (responseType='blob')
 * @returns 包含blob数据和文件名的对象 { blob, fileName }
 * @example
 * const res = await axios.get(url, { responseType: 'blob' });
 * const { blob, fileName } = await parseAxiosBlob(res);
 * download(blob, fileName);
 */
export async function parseAxiosBlob(res: AxiosResponse<Blob>) {
  const { data, headers, status, statusText, config } = res;

  if (status < 200 || status >= 300) throw new Error(`${status}，${statusText}：${config.url}`);

  // 抛出json错误
  if (data.type.includes('application/json')) {
    const txt = await data.text();
    throw JSON.parse(txt);
  }

  // 解析文件名
  const fileName = getDispositionFileName(headers['content-disposition']);
  return { blob: data, fileName };
}

/**
 * 获取文件名
 * @param disposition content-disposition头值
 * @returns content-disposition中的filename
 * @example
 * const fileName = getDispositionFileName(headers['content-disposition']);
 */
export function getDispositionFileName(disposition?: string) {
  if (!disposition) return '';

  // 1. RFC5987 filename* 优先
  const rfc5987 = /filename\*\s*=\s*([^']*)''([^;]*)/i.exec(disposition);
  if (rfc5987?.[2]) {
    try {
      return decodeURIComponent(rfc5987[2].trim()).replace(/[\r\n]+/g, '');
    } catch {
      return rfc5987[2].trim().replace(/[\r\n]+/g, '');
    }
  }

  // 2. 旧式 filename=
  const old = /filename\s*=\s*(?:"([^"]*)"|([^";]*))(?=;|$)/i.exec(disposition);
  if (old) return (old[1] ?? old[2]).trim().replace(/[\r\n]+/g, '');

  return '';
}

/**
 * 动态加载 JS（重复执行不会重复加载，内部已排重）
 * @param src js 文件路径
 * @param attrs 可选的脚本属性，如 async、defer、crossOrigin
 * @example
 * await loadJs('https://xx/xx.js');
 * await loadJs('/a.js', { defer: true });
 */
export async function loadJs(
  src: string,
  attrs?: Pick<HTMLScriptElement, 'async' | 'defer' | 'crossOrigin'>,
) {
  return new Promise<void>((resolve, reject) => {
    if (hasJs(src)) return resolve();

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;

    if (attrs) {
      const keys = Object.keys(attrs) as Array<keyof typeof attrs>;
      keys.forEach((key) => {
        const v = attrs[key];
        if (v === null || v === undefined || v === false) return;
        script.setAttribute(key, typeof v === 'boolean' ? '' : v);
      });
    }

    script.onload = () => resolve();
    script.onerror = (e) => reject(e);

    document.head.appendChild(script);
  });
}

/**
 * 判断某个 JS 地址是否已在页面中加载过
 * @param src 相对、绝对路径的 JS 地址
 * @returns 是否已加载过
 * @example
 * hasJs('https://xx/xx.js'); // boolean
 * hasJs('/xx.js'); // boolean
 * hasJs('xx.js'); // boolean
 */
export function hasJs(src: string) {
  const target = new URL(src, document.baseURI).href;
  const jsList = Array.from(document.querySelectorAll('script[src]'));
  return jsList.some((e) => {
    const src = e.getAttribute('src');
    return src && new URL(src, document.baseURI).href === target;
  });
}

/**
 * 动态加载 CSS（重复执行不会重复加载，内部已排重）
 * @param href css 文件地址
 * @param attrs 可选属性，如 crossOrigin、media
 * @example
 * await loadCss('https://xx/xx.css');
 * await loadCss('/a.css', { media: 'print' });
 */
export async function loadCss(
  href: string,
  attrs?: Pick<HTMLLinkElement, 'crossOrigin' | 'media'>,
) {
  return new Promise<void>((resolve, reject) => {
    if (hasCss(href)) return resolve();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    if (attrs) {
      const keys = Object.keys(attrs) as Array<keyof typeof attrs>;
      keys.forEach((key) => {
        const v = attrs[key];
        if (v === null || v === undefined) return;
        link.setAttribute(key, String(v));
      });
    }

    link.onload = () => resolve();
    link.onerror = (e) => reject(e);

    document.head.appendChild(link);
  });
}

/**
 * 判断某个 CSS 地址是否已在页面中加载过
 * @param href 相对、绝对路径的 CSS 地址
 * @returns 是否已加载过
 * @example
 * hasCss('https://xx/xx.css'); // boolean
 */
export function hasCss(href: string) {
  const target = new URL(href, document.baseURI).href;
  const list = Array.from(document.querySelectorAll('link[rel="stylesheet"][href]'));
  return list.some((e) => {
    const h = e.getAttribute('href');
    return h && new URL(h, document.baseURI).href === target;
  });
}

/**
 * 预加载图片
 * @param src 图片地址
 * @returns Promise<HTMLImageElement>
 * @example
 * await preloadImage('/a.png');
 */
export function preloadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
