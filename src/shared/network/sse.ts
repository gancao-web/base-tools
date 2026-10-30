import { SSEParser, type MessageCallback } from '../../ts/buffer/SSEParser';
import { createLogSnapshot } from './logSnapshot';
import { runRequestEffect, type RequestLogInfo } from './requestLog';

/** 观察完整消息；不能展开 logExtra，否则会提前触发结束上下文和总计时。 */
export function createSseParser(
  log: ((level: 'info' | 'error', info: RequestLogInfo) => unknown) | undefined,
  extra: Record<string, unknown> | undefined,
  onMessage: MessageCallback | undefined,
  isActive: () => boolean,
) {
  if (!log && !onMessage) return undefined;
  return new SSEParser(
    (message) => { if (isActive()) onMessage?.(message); },
    (message, protocol) => {
      if (!isActive() || !log) return;
      const receivedAtMs = Date.now();
      runRequestEffect(() => {
        const info: RequestLogInfo = {
          name: 'sseMessage', requestType: 'sse', receivedAtMs, data: message, ...protocol,
        };
        const startContext = extra?.startContext;
        if (startContext !== undefined) info.startContext = startContext;
        return log('info', createLogSnapshot(info));
      });
    },
  );
}
