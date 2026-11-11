import { isPlainObject } from 'es-toolkit';
import PolyfillTextDecoder from '../../ts/buffer/PolyfillTextDecoder';
import type { SSEMessage } from '../../ts/buffer/SSEParser';

/** 重连专用的完整帧解析器；不改变独立 SSEParser 的历史兼容行为。 */
export class SseStreamParser {
  private decoder = typeof TextDecoder !== 'undefined'
    ? new TextDecoder('utf-8') : new PolyfillTextDecoder();
  private line = '';
  private afterCr = false;
  private first = true;
  private data: string[] = [];
  private event?: string;
  private id?: string;
  private retry?: number;
  private frameSize = 0;
  private pendingSize = 0;
  private tail: Promise<void> = Promise.resolve();
  private failed = false;
  private failure: unknown;
  // UTF-16 单元上限，包含当前帧及排队中的完整帧，避免推送平台无限积压。
  private readonly limit = 1024 * 1024;

  constructor(private hooks: {
    isActive(): boolean;
    onMessage(message: SSEMessage): unknown;
    onCommit(id: string | undefined, retry: number | undefined, message: boolean): void;
  }) {}

  receive(buffer: ArrayBuffer) {
    const text = this.decoder.decode(new Uint8Array(buffer), { stream: true });
    for (const char of text) {
      if (!this.hooks.isActive() || this.failed) break;
      if (this.first) {
        this.first = false;
        if (char === '\uFEFF') continue;
      }
      if (this.afterCr) {
        this.afterCr = false;
        if (char === '\n') continue;
      }
      this.frameSize += char.length;
      if (this.frameSize + this.pendingSize > this.limit) {
        throw new Error('SSE pending data limit exceeded');
      }
      if (char === '\r' || char === '\n') {
        this.processLine(this.line);
        this.line = '';
        this.afterCr = char === '\r';
      } else this.line += char;
    }
  }

  /** EOF 时故意不 flush：没有空行边界的事件不属于已接受帧。 */
  async drain() {
    await this.tail;
    if (this.failed) throw this.failure;
  }

  private processLine(line: string) {
    if (line === '') {
      this.dispatch();
      return;
    }
    if (line.startsWith(':')) {
      // 心跳不累积为无界事件；仍保留当前 data 帧的大小。
      this.frameSize -= line.length + 1;
      return;
    }
    const colon = line.indexOf(':');
    const field = colon < 0 ? line : line.slice(0, colon);
    let value = colon < 0 ? '' : line.slice(colon + 1);
    if (value.startsWith(' ')) value = value.slice(1);
    if (field === 'data') this.data.push(value);
    else if (field === 'event') this.event = value;
    else if (field === 'id' && !value.includes('\0')) this.id = value;
    else if (field === 'retry' && /^[0-9]+$/.test(value)) {
      const retry = Number(value);
      if (Number.isSafeInteger(retry)) this.retry = retry;
    }
  }

  private dispatch() {
    const data = this.data;
    const event = this.event;
    const id = this.id;
    const retry = this.retry;
    const size = this.frameSize;
    this.data = [];
    this.event = this.id = undefined;
    this.retry = undefined;
    this.frameSize = 0;
    if (!data.length && id === undefined && retry === undefined) return;
    this.pendingSize += size;
    this.tail = this.tail.then(async () => {
      if (this.failed || !this.hooks.isActive()) return;
      try {
        if (data.length) {
          const text = data.join('\n');
          let message: SSEMessage;
          if (text.trim() === '[DONE]') message = { type: 'DONE' };
          else {
            try {
              const json = JSON.parse(text);
              message = isPlainObject(json) ? json : { data: json };
            } catch { message = { raw: text }; }
          }
          // 业务对象字段保持旧的优先级；游标通过独立协议元数据提交。
          if (event && message.event === undefined) message.event = event;
          if (event && message.type === undefined) message.type = event;
          if (id !== undefined && message.id === undefined) message.id = id;
          if (retry !== undefined && message.retry === undefined) message.retry = retry;
          await this.hooks.onMessage(message);
        }
        if (this.hooks.isActive()) this.hooks.onCommit(id, retry, data.length > 0);
      } catch (error) {
        this.failed = true;
        this.failure = error;
      } finally { this.pendingSize -= size; }
    });
  }
}
