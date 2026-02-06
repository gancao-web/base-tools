/**
 * 复制文本到剪贴板（兼容移动端和PC）
 * @returns Promise<void> 复制成功时 resolve，失败时 reject。
 * @example
 * await copyText('hello');
 * toast('复制成功');
 */
export async function copyText(text: string): Promise<void> {
  if (typeof text !== 'string') text = String(text ?? '');

  // 现代 API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (e) {
      // 继续尝试回退方案
    }
  }

  // 回退方案：使用隐藏 textarea + execCommand('copy')
  return new Promise<void>((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;

      // 避免视觉影响与页面布局影响
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.right = '-9999px';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';

      document.body.appendChild(textarea);

      // 选中文本（移动端兼容）
      textarea.focus();
      textarea.select();

      // iOS 兼容：明确选区
      textarea.setSelectionRange(0, textarea.value.length);

      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (ok) {
        resolve();
      } else {
        reject(new Error('Copy failed: clipboard unavailable'));
      }
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 复制富文本 HTML 到剪贴板（移动端与 PC）
 * 使用场景：图文混排文章、带样式段落，保留格式粘贴。
 * @param html HTML字符串
 * @example
 * await copyHtml('<p><b>加粗</b> 与 <i>斜体</i></p>');
 */
export async function copyHtml(html: string): Promise<void> {
  const s = String(html ?? '');
  if (canWriteClipboard()) {
    const plain = htmlToText(s);
    await writeClipboard({
      'text/html': new Blob([s], { type: 'text/html' }),
      'text/plain': new Blob([plain], { type: 'text/plain' }),
    });
    return;
  }
  return execCopyFromHtml(s);
}

/**
 * 复制 DOM 节点到剪贴板（移动端与 PC）
 * 使用场景：页面已有区域的可视化复制；元素使用 `outerHTML`，非元素使用其文本内容。
 * @param node DOM 节点（元素或文本节点）
 * @example
 * const el = document.querySelector('#article')!;
 * await copyNode(el);
 */
export async function copyNode(node: Node): Promise<void> {
  if (canWriteClipboard()) {
    const { html, text } = nodeToHtmlText(node);
    await writeClipboard({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([text], { type: 'text/plain' }),
    });
    return;
  }
  const { html } = nodeToHtmlText(node);
  return execCopyFromHtml(html);
}

/**
 * 复制单张图片到剪贴板（移动端与 PC，需浏览器支持 `ClipboardItem`）
 * 使用场景：把本地 `canvas` 或 `Blob` 生成的图片直接粘贴到聊天/文档。
 * @param image 图片源（Blob/Canvas/ImageBitmap）
 * @example
 * const canvas = document.querySelector('canvas')!;
 * await copyImage(canvas);
 */
export async function copyImage(image: Blob | HTMLCanvasElement | ImageBitmap): Promise<void> {
  const blob = await toImageBlob(image);
  if (!blob) throw new Error('Unsupported image source');
  if (canWriteClipboard()) {
    const type = blob.type || 'image/png';
    await writeClipboard({ [type]: blob });
    return;
  }
  throw new Error('Clipboard image write not supported');
}

/**
 * 复制 URL 到剪贴板（移动端与 PC）
 * 写入 `text/uri-list` 与 `text/plain`，在支持 URI 列表的应用中可识别为链接。
 * @param url 完整的 URL 字符串
 * @example
 * await copyUrl('https://example.com/page');
 */
export async function copyUrl(url: string): Promise<void> {
  const s = String(url ?? '');
  if (canWriteClipboard()) {
    await writeClipboard({
      'text/uri-list': new Blob([s], { type: 'text/uri-list' }),
      'text/plain': new Blob([s], { type: 'text/plain' }),
    });
    return;
  }
  await copyText(s);
}

/**
 * 复制任意 Blob 到剪贴板（移动端与 PC，需 `ClipboardItem`）
 * 使用场景：原生格式粘贴（如 `image/svg+xml`、`application/pdf` 等）。
 * @param blob 任意 Blob 数据
 * @example
 * const svg = new Blob(['<svg></svg>'], { type: 'image/svg+xml' });
 * await copyBlob(svg);
 */
export async function copyBlob(blob: Blob): Promise<void> {
  if (canWriteClipboard()) {
    const type = blob.type || 'application/octet-stream';
    await writeClipboard({ [type]: blob });
    return;
  }
  throw new Error('Clipboard blob write not supported');
}

/**
 * 复制 RTF 富文本到剪贴板（移动端与 PC）
 * 同时写入 `text/plain`，增强与 Office/富文本编辑器的兼容性。
 * @param rtf RTF 字符串（如：`{\\rtf1\\ansi ...}`）
 * @example
 * await copyRtf('{\\rtf1\\ansi Hello \\b World}');
 */
export async function copyRtf(rtf: string): Promise<void> {
  const s = String(rtf ?? '');
  if (canWriteClipboard()) {
    const plain = s
      .replace(/\\par[\s]?/g, '\n')
      .replace(/\{[^}]*\}/g, '')
      .replace(/\\[a-zA-Z]+[0-9'-]*/g, '')
      .replace(/\r?\n/g, '\n')
      .trim();
    await writeClipboard({
      'text/rtf': new Blob([s], { type: 'text/rtf' }),
      'text/plain': new Blob([plain], { type: 'text/plain' }),
    });
    return;
  }
  await copyText(s);
}

/**
 * 复制表格到剪贴板（移动端与 PC）
 * 同时写入多种 MIME：`text/html`（表格）、`text/tab-separated-values`（TSV）、`text/csv`、`text/plain`（TSV）。
 * 使用场景：优化粘贴到 Excel/Google Sheets/Docs 的体验
 * @param rows 二维数组，每行一个数组（字符串/数字）
 * @example
 * await copyTable([
 *   ['姓名', '分数'],
 *   ['张三', 95],
 *   ['李四', 88],
 * ]);
 */
export async function copyTable(rows: Array<Array<string | number>>): Promise<void> {
  const data = Array.isArray(rows) ? rows : [];
  const escapeHtml = (t: string) =>
    t
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  const html = (() => {
    const trs = data
      .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(String(c))}</td>`).join('')}</tr>`)
      .join('');
    return `<table>${trs}</table>`;
  })();
  const tsv = data.map((r) => r.map((c) => String(c)).join('\t')).join('\n');
  const csv = data
    .map((r) =>
      r
        .map((c) => {
          const s = String(c);
          const needQuote = /[",\n]/.test(s);
          const escaped = s.replace(/"/g, '""');
          return needQuote ? `"${escaped}"` : escaped;
        })
        .join(','),
    )
    .join('\n');
  if (canWriteClipboard()) {
    await writeClipboard({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/tab-separated-values': new Blob([tsv], { type: 'text/tab-separated-values' }),
      'text/csv': new Blob([csv], { type: 'text/csv' }),
      'text/plain': new Blob([tsv], { type: 'text/plain' }),
    });
    return;
  }
  await copyText(tsv);
}

async function toImageBlob(image: Blob | HTMLCanvasElement | ImageBitmap) {
  if (image instanceof Blob) return image;
  if (image instanceof HTMLCanvasElement)
    return await new Promise<Blob>((resolve, reject) => {
      image.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
        'image/png',
      );
    });
  const isBitmap = typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap;
  if (isBitmap) {
    const cnv = document.createElement('canvas');
    cnv.width = (image as ImageBitmap).width;
    cnv.height = (image as ImageBitmap).height;
    const ctx = cnv.getContext('2d');
    ctx?.drawImage(image as ImageBitmap, 0, 0);
    return await new Promise<Blob>((resolve, reject) => {
      cnv.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), 'image/png');
    });
  }
  return null;
}

function canWriteClipboard() {
  return !!(
    navigator.clipboard &&
    typeof navigator.clipboard.write === 'function' &&
    typeof ClipboardItem !== 'undefined'
  );
}

async function writeClipboard(items: Record<string, Blob>) {
  await navigator.clipboard!.write([new ClipboardItem(items)]);
}

function htmlToText(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

function nodeToHtmlText(node: Node) {
  const container = document.createElement('div');
  container.appendChild(node.cloneNode(true));
  const html =
    node instanceof Element ? (node.outerHTML ?? container.innerHTML) : container.innerHTML;
  const text = container.textContent || '';
  return { html, text };
}

function execCopyFromHtml(html: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.style.position = 'fixed';
      div.style.top = '0';
      div.style.right = '-9999px';
      div.style.opacity = '0';
      div.style.pointerEvents = 'none';
      div.innerHTML = html;
      document.body.appendChild(div);
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(div);
      selection?.removeAllRanges();
      selection?.addRange(range);
      const ok = document.execCommand('copy');
      document.body.removeChild(div);
      selection?.removeAllRanges();
      if (ok) {
        resolve();
      } else {
        reject(new Error('Copy failed: clipboard unavailable'));
      }
    } catch (e) {
      reject(e);
    }
  });
}
