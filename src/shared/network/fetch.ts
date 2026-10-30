import { isPlainObject, pickBy } from 'es-toolkit';
import { appendUrlParam } from '../../ts/url';
import type { SSEParser } from '../../ts/buffer/SSEParser';

export type FetchRequestHeader = Record<string, string | number | boolean | null | undefined>;

/**
 * 流式解析对象。
 * - undefined: 未初始化
 * - null: 已取消
 */
export type SseTask = { parser: SSEParser | undefined | null };

/** 过滤 undefined，保留 null、空字符串、false 和 0 等有效参数。 */
export function filterRequestData(data: Record<string, any>) {
  return pickBy(data, (value) => value !== undefined);
}

/** 过滤空请求头，并将 Fetch 不支持的数字、布尔值转换为字符串。 */
export function filterRequestHeader(header?: FetchRequestHeader) {
  const result: Record<string, string> = {};
  if (header) {
    Object.entries(header).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') result[key] = String(value);
    });
  }
  return result;
}

/** 将通用请求参数转换为 Fetch 所需的 URL、Header 和 Body。 */
export function createFetchRequest(options: {
  url: string;
  method?: string;
  data?: unknown;
  header?: FetchRequestHeader;
}) {
  const method = options.method || 'GET';
  const isQueryMethod = method === 'GET' || method === 'HEAD';
  const headers = filterRequestHeader(options.header);
  const contentTypeKey = Object.keys(headers).find((key) => key.toLowerCase() === 'content-type');
  const contentType = contentTypeKey ? headers[contentTypeKey].toLowerCase() : '';
  const isObjectData = isPlainObject(options.data);
  const isArrayData = !isObjectData && Array.isArray(options.data);

  if (isQueryMethod && isObjectData) {
    return {
      url: appendUrlParam(options.url, options.data as Record<string, unknown>),
      headers,
      body: undefined,
    };
  }

  let body: BodyInit | null | undefined;
  if (!isQueryMethod && options.data !== undefined && options.data !== null) {
    if (isObjectData && contentType.includes('application/x-www-form-urlencoded')) {
      body = toSearchParams(options.data as Record<string, unknown>);
    } else if (isObjectData && contentType.includes('multipart/form-data')) {
      body = toFormData(options.data as Record<string, unknown>);
      // Fetch 必须自行生成 multipart boundary，调用方不能保留原 Content-Type。
      if (contentTypeKey) delete headers[contentTypeKey];
    } else if (isObjectData || isArrayData) {
      if (!contentTypeKey) headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.data);
    } else {
      body = options.data as BodyInit;
    }
  }

  return { url: options.url, headers, body };
}

/** 持续读取 Fetch 响应流并交给 SSEParser 增量解析。 */
export async function handleFetchStreamResponse(
  response: Response,
  sseTask: SseTask,
  onBodyRead?: () => void,
): Promise<void> {
  if (!response.body) throw new Error('Response body is null');

  const reader = response.body.getReader();

  const checkAborted = async () => {
    if (sseTask.parser !== null) return;
    try {
      await reader.cancel();
    } catch {
      // 关闭错误不覆盖已确认的取消结果
    }
    throw new DOMException('Body stream was aborted', 'AbortError');
  };

  try {
    while (true) {
      await checkAborted();
      const { done, value } = await reader.read();
      await checkAborted();
      if (done) break;
      // slice 避免 byteOffset/byteLength 不覆盖底层 ArrayBuffer 时把无关字节交给解析器。
      if (value) {
        const chunk = value.slice();
        sseTask.parser?.receive(chunk.buffer);
      }
    }

    onBodyRead?.();
    sseTask.parser?.flush();
    // 尾消息业务回调也可能取消；不能在取消之后仍记 EOF 成功。
    await checkAborted();
  } finally {
    reader.releaseLock();
  }
}

/** 按指定响应类型读取 Fetch 响应，并兼容 HTTP 异常中的 JSON 业务响应。 */
export async function parseFetchResponse(
  response: Response,
  responseType: string,
  onBodyRead?: (body?: unknown) => void,
) {
  if (!response.ok) {
    const text = await response.text();
    onBodyRead?.(text);

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`HTTP Error ${response.status}: ${text || response.statusText}`);
    }
  }

  if (responseType === 'arraybuffer') {
    const body = await response.arrayBuffer();
    onBodyRead?.();
    return body;
  }

  const text = await response.text();
  onBodyRead?.();
  if (responseType === 'text') return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toSearchParams(data: Record<string, unknown>) {
  const params = new URLSearchParams();
  for (const key in data) {
    const value = data[key];
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((item) =>
        params.append(key, typeof item === 'object' ? JSON.stringify(item) : String(item)),
      );
    } else {
      params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  }
  return params;
}

function toFormData(data: Record<string, unknown>) {
  const formData = new FormData();
  for (const key in data) {
    const value = data[key];
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((item) =>
        formData.append(
          key,
          item instanceof Blob
            ? item
            : typeof item === 'object'
              ? JSON.stringify(item)
              : String(item),
        ),
      );
    } else {
      formData.append(
        key,
        value instanceof Blob
          ? value
          : typeof value === 'object'
            ? JSON.stringify(value)
            : String(value),
      );
    }
  }
  return formData;
}
