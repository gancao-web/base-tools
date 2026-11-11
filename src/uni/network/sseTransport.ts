import PolyfillTextDecoder from '../../ts/buffer/PolyfillTextDecoder';
import { runRequestEffect } from '../../shared/network/requestLog';
import { SseTransportError } from '../../shared/network/sseReconnect';
import type { SseTransport } from '../../shared/network/sseReconnectTypes';

type Listener = (event: any) => void;
type ChunkRequestTask = UniApp.RequestTask & {
  onChunkReceived?: (listener: Listener) => void;
  offChunkReceived?: (listener?: Listener) => void;
};

/** 为多次原生传输保留同一套公开监听器；只接纳能确认握手状态的分块宿主。 */
export function createUniSseTransport(config: UniApp.RequestOptions) {
  // 仅复制平台配置，避免把回调、协议策略或请求转换器交给宿主。
  const nativeConfig: UniApp.RequestOptions = { url: config.url };
  const keys = ['timeout', 'dataType', 'responseType', 'sslVerify', 'withCredentials', 'firstIpv4',
    'enableHttp2', 'enableQuic', 'enableCache', 'enableHttpDNS', 'httpDNSServiceId',
    'forceCellularNetwork', 'enableCookie', 'cloudCache', 'defer'] as const;
  for (const key of keys) {
    if (config[key] !== undefined) Object.assign(nativeConfig, { [key]: config[key] });
  }
  const headersListeners = new Set<Listener>();
  const chunkListeners = new Set<Listener>();
  const taskMethods = {
    onHeadersReceived(listener: Listener) { headersListeners.add(listener); },
    offHeadersReceived(listener?: Listener) { if (listener) headersListeners.delete(listener); else headersListeners.clear(); },
    onChunkReceived(listener: Listener) { chunkListeners.add(listener); },
    offChunkReceived(listener?: Listener) { if (listener) chunkListeners.delete(listener); else chunkListeners.clear(); },
  };
  const transport: SseTransport = (request, hooks) => new Promise((resolve, reject) => {
    let ended = false;
    let status: number | undefined;
    let header: Record<string, unknown> = {};
    let headersReady = false;
    let stream = false;
    let body = '';
    const decoder = new PolyfillTextDecoder();
    let task: ChunkRequestTask | undefined;
    const detach = () => {
      runRequestEffect(() => task?.offChunkReceived?.(onChunk));
      runRequestEffect(() => task?.offHeadersReceived?.(onHeaders));
    };
    const fail = (error: unknown) => {
      if (ended) return;
      ended = true;
      detach();
      runRequestEffect(() => task?.abort());
      reject(error);
    };
    const onHeaders = (event: { header: Record<string, unknown>; statusCode?: number }) => {
      if (ended) return;
      header = { ...event.header };
      status = event.statusCode;
      headersReady = true;
      stream = hooks.onHeaders(status, header);
      if (ended) return;
      for (const listener of headersListeners) runRequestEffect(() => listener(event));
    };
    const onChunk = (event: { data: ArrayBuffer }) => {
      if (ended) return;
      if (!headersReady || status === undefined) {
        fail(new SseTransportError('SSE reconnect requires response headers and status before chunks on this platform', true));
        return;
      }
      for (const listener of chunkListeners) runRequestEffect(() => listener(event));
      if (stream) hooks.onChunk(event.data).catch(fail);
      else {
        body += decoder.decode(event.data, { stream: true });
        if (body.length > 1024 * 1024) fail(new SseTransportError('SSE error response limit exceeded', true));
      }
    };
    task = uni.request({
      ...nativeConfig, ...request, header: request.header, data: request.data as UniApp.RequestOptions['data'],
      method: request.method as UniApp.RequestOptions['method'], enableChunked: true,
      success(response) {
        if (ended) return;
        ended = true;
        detach();
        if (!headersReady) hooks.onHeaders(response.statusCode, response.header);
        resolve({ status: response.statusCode, header: response.header, body: body || response.data });
      },
      fail(error) {
        fail(error.errMsg?.includes('timeout')
          ? new SseTransportError('Request Timeout', false, true) : error);
      },
      complete: undefined,
    });
    hooks.setCancel(() => fail(new SseTransportError('SSE transport cancelled')));
    if (!task.onChunkReceived || !task.onHeadersReceived || !task.offChunkReceived || !task.offHeadersReceived) {
      fail(new SseTransportError('SSE reconnect chunk transport is unsupported on this platform', true));
      return;
    }
    task.onHeadersReceived(onHeaders);
    task.onChunkReceived(onChunk);
  });
  return { transport, taskMethods };
}
