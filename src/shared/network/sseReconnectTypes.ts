import type { SSEMessage } from '../../ts/buffer/SSEParser';

export type SseReconnectContext = {
  reason: 'network' | 'http' | 'timeout' | 'eof' | 'response';
  error?: unknown;
  httpStatus?: number;
  /** 已发起的连接次数，从 1 开始。 */
  attempt: number;
  /** 本轮连续失败后的重试序号，从 1 开始。 */
  retry: number;
  lastEventId: string;
  defaultRetry: boolean;
};

export type SseState = 'connecting' | 'connected' | 'reconnecting' | 'completed' | 'failed' | 'aborted';
export type SseStateChange = {
  state: SseState;
  attempt: number;
  lastEventId: string;
  delay?: number;
  context?: SseReconnectContext;
};

export type SseReconnectOptions = {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  jitter?: number;
  onEof?: boolean;
  respectServerRetry?: boolean;
  allowReplay?: boolean;
  /** true/false 覆盖默认错误策略；不能覆盖取消、业务回调失败及重放限制。抛错则结束订阅。 */
  shouldReconnect?: (context: SseReconnectContext) => boolean | Promise<boolean>;
};

export type SseReconnectConfig = {
  /** 仅 enableChunked=true 时启用，默认关闭。 */
  reconnect?: boolean | SseReconnectOptions;
  /** 初始协议游标；显式空字符串会移除请求头中的旧游标。 */
  lastEventId?: string;
  /** 状态观察器异常不会影响请求。 */
  onSseStateChange?: (change: SseStateChange) => void;
};

export type SseReconnectTask = {
  abort(): void;
  complete(): void;
  fail(error: unknown, businessCode?: string | number): void;
  readonly lastEventId: string;
};

export type SsePreparedRequest = {
  url: string;
  method: string;
  header: Record<string, string>;
  data?: unknown;
};

export type SseTransportHooks = {
  setCancel(cancel: () => void): void;
  onHeaders(status: number | undefined, header: Record<string, unknown>): boolean;
  /** 推送平台可不等待此 Promise；解析器自身限制待处理数据总量。 */
  onChunk(data: ArrayBuffer): Promise<void>;
};

export type SseTransportResult = {
  status: number | undefined;
  header: Record<string, unknown>;
  body?: unknown;
};

export type SseTransport = (
  request: SsePreparedRequest,
  hooks: SseTransportHooks,
) => Promise<SseTransportResult>;

export type SseMessageHandler = (message: SSEMessage) => void | Promise<void>;
