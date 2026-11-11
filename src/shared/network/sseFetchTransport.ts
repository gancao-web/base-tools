import { createFetchRequest } from './fetch';
import { SseTransportError } from './sseReconnect';
import type { SseTransport } from './sseReconnectTypes';

/** Fetch 按块等待解析与业务处理，提供读取背压。 */
export function createSseFetchTransport(fetchOptions?: Omit<RequestInit, 'method' | 'headers' | 'body' | 'signal'>): SseTransport {
  return async (request, hooks) => {
    const controller = new AbortController();
    hooks.setCancel(() => controller.abort());
    let prepared: ReturnType<typeof createFetchRequest>;
    try {
      prepared = createFetchRequest({ ...request, header: request.header });
      // Fetch 的 JS Header 接口接受 ByteString；协议规定 Last-Event-ID 使用 UTF-8 字节。
      const id = prepared.headers['Last-Event-ID'];
      if (id) prepared.headers['Last-Event-ID'] = Array.from(new TextEncoder().encode(id), (byte) => String.fromCharCode(byte)).join('');
      // Header 配置错误属于准备失败，不能当成断网重发。
      new Headers(prepared.headers);
    } catch (error) { throw new SseTransportError('Failed to prepare SSE transport', true, false, error); }
    const response = await fetch(prepared.url, {
      ...fetchOptions, method: request.method, headers: prepared.headers,
      body: prepared.body, signal: controller.signal,
    });
    const header: Record<string, unknown> = {};
    response.headers.forEach((value, key) => { header[key] = value; });
    const stream = hooks.onHeaders(response.status, header);
    const result = { status: response.status, header };
    if (controller.signal.aborted) return result;
    if (response.status === 204) return result;
    if (!stream) return { ...result, body: await response.text() };
    if (!response.body) throw new Error('SSE response body is null');
    const reader = response.body.getReader();
    try {
      while (!controller.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) await hooks.onChunk(value.slice().buffer);
      }
    } finally {
      // 业务处理异常时关闭 reader；外层也会取消整个当前传输。
      try { await reader.cancel(); } catch { /* 关闭错误不覆盖原始结果。 */ }
      reader.releaseLock();
    }
    return result;
  };
}
