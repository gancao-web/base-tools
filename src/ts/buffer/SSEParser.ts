import { isPlainObject } from 'es-toolkit';
import PolyfillTextDecoder from './PolyfillTextDecoder';

/** 流式数据消息 */
export type SSEMessage = {
  /**
   * SSE 消息类型
   * - 'DONE' 流式数据接收完毕
   * - 'thinking' 思考中
   * - 'text' 文本内容
   * - 其他业务类型
   */
  type?: string;

  /** SSE 事件 ID (如 'id:123') */
  id?: string;

  /** SSE 建议重连时间 (毫秒, 如 'retry:5000') */
  retry?: number;

  /** SSE 事件类型 (如 'event:customEvent') */
  event?: string;

  /**
   * 除type之外的其他data数据
   * - 思考中 'data:{"type": "thinking", "content": "xx"}' -> {type: 'thinking', content: 'xx'}
   * - JSON数据 'data:{"type": "text", "content": "xx"}' -> {type: 'text', content: 'xx'}
   * - 非JSON数据 'data:xx' -> {raw: 'xx'}
   * - 接收完毕 'data:[DONE]' -> {type: 'DONE'}
   */
  [key: string]: any;
};

/** 流式数据消息回调 */
export type MessageCallback = (msg: SSEMessage) => void;

/**
 * 流式数据解析器
 * - 对于不支持TextDecoder的环境，使用PolyfillTextDecoder (bufferToText流式增强版)
 * @description 用于解析 SSE 流式数据，将其转换为 SSEMessage 格式并调用回调函数处理
 * @param onMessage 消息回调
 * @example
 * const parser = new SSEParser((msg) => {
 *   console.log(msg);
 * });
 * parser.receive(arrayBuffer);
 */
export class SSEParser {
  private buffer: string = '';
  private onMessage: MessageCallback;
  private decoder: TextDecoder | PolyfillTextDecoder;
  private eventDataLines: string[] = [];
  private eventType?: string;
  private eventId?: string;
  private eventRetry?: number;

  constructor(onMessage: MessageCallback) {
    this.onMessage = onMessage;
    this.decoder =
      typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8') : new PolyfillTextDecoder();
  }

  /**
   * 接收流式数据
   * @param buffer ArrayBuffer
   */
  receive(buffer: ArrayBuffer) {
    const text = this.decoder.decode(new Uint8Array(buffer), { stream: true });
    this.appendText(text);
  }

  /**
   * 刷新解码器残留数据并处理尾部未换行的内容
   */
  flush() {
    const tail = this.decoder.decode(undefined, { stream: false });
    if (tail) this.appendText(tail);

    this.flushRemainder();
  }

  /**
   * 追加文本并按行拆分处理，保留不完整尾行
   * @param text 新到达的文本片段
   */
  private appendText(text: string) {
    this.buffer += text;

    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop() || '';

    this.processLines(lines);
  }

  /**
   * 处理缓冲区中剩余的尾行内容
   */
  private flushRemainder() {
    if (!this.buffer.trim()) {
      this.buffer = '';
      return;
    }
    const rest = this.buffer;
    this.buffer = '';
    this.processLines([rest, '']);
  }

  /**
   * 解析每行 SSE 数据并触发回调
   * @param lines 以换行切分后的行内容
   */
  private processLines(lines: string[]) {
    for (const line of lines) {
      if (!line.trim()) {
        this.dispatchEvent();
        continue;
      }

      if (line.startsWith(':')) continue;

      const colonIndex = line.indexOf(':');
      const field = colonIndex === -1 ? line : line.slice(0, colonIndex);
      let value = colonIndex === -1 ? '' : line.slice(colonIndex + 1);
      if (value.startsWith(' ')) value = value.slice(1);

      if (field === 'data') {
        this.eventDataLines.push(value);
        continue;
      }

      if (field === 'event') {
        this.eventType = value || undefined;
        continue;
      }

      if (field === 'id') {
        this.eventId = value || undefined;
        continue;
      }

      if (field === 'retry') {
        const retry = Number(value);
        this.eventRetry = Number.isFinite(retry) ? retry : undefined;
        continue;
      }
    }
  }

  /**
   * 将当前缓存的一次 SSE 事件分发给回调
   * @description 以空行作为事件边界，将多行 data 合并后再解析；处理 "[DONE]" 结束标记；分发完成后会重置事件缓存
   */
  private dispatchEvent() {
    if (!this.eventDataLines.length) {
      this.resetEvent();
      return;
    }

    const data = this.eventDataLines.join('\n');

    if (!data) {
      this.resetEvent();
      return;
    }

    if (data.trim() === '[DONE]') {
      this.safeOnMessage({ type: 'DONE' });
      this.resetEvent();
      return;
    }

    let msg: SSEMessage;

    try {
      // 尝试解析 JSON 数据
      const json = JSON.parse(data);
      // 'data:{"type": "text", "content": "xx"}' -> {type: 'text', content: 'xx'}
      // 'data:[1,2,3]' -> {data: [1,2,3]}
      msg = isPlainObject(json) ? json : { data: json };
    } catch (e) {
      // 解析失败时，返回原始数据。'data:xx' -> {raw: 'xx'}
      msg = { raw: data };
    }

    // 补充SSE协议头中的对应值 (若 JSON 中包含 id/event/retry 字段，优先使用 JSON 中的值)
    if (this.eventType && msg.event === undefined) msg.event = this.eventType;
    if (this.eventType && msg.type === undefined) msg.type = this.eventType;
    if (this.eventId && msg.id === undefined) msg.id = this.eventId;
    if (this.eventRetry !== undefined && msg.retry === undefined) msg.retry = this.eventRetry;

    this.safeOnMessage(msg);
    this.resetEvent();
  }

  /** 安全调用 onMessage 回调，捕获并打印错误 */
  private safeOnMessage(msg: SSEMessage) {
    try {
      this.onMessage(msg);
    } catch (onMessageError) {
      console.error('SSEParser onMessage error:', onMessageError);
    }
  }

  /** 重置当前 SSE 事件的临时缓存 */
  private resetEvent() {
    this.eventDataLines = [];
    this.eventType = undefined;
    this.eventId = undefined;
    this.eventRetry = undefined;
  }
}
