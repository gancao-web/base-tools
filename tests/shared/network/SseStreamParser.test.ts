import { describe, expect, it } from 'vitest';
import { SseStreamParser } from '../../../src/shared/network/SseStreamParser';

const bytes = (text: string) => new TextEncoder().encode(text).buffer;

describe('reconnect SSE complete-frame parsing', () => {
  it('串行处理，使用独立协议 ID，保留空数据事件并支持 CR、分块 CRLF', async () => {
    const events: string[] = [];
    let release!: () => void;
    const parser = new SseStreamParser({
      isActive: () => true,
      async onMessage(msg) {
        events.push(`message:${msg.id || msg.raw || 'empty'}`);
        if (msg.id === 'business') await new Promise<void>((resolve) => { release = resolve; });
      },
      onCommit(id, retry) { events.push(`commit:${id}:${retry}`); },
    });
    parser.receive(bytes('id:protocol\rdata:{"id":"business"}\r\rid:\r'));
    parser.receive(bytes('\n\r\ndata:\r\n\r\nretry:12\n\nid:unfinished\ndata:tail'));
    await Promise.resolve();
    expect(events).toEqual(['message:business']);
    release();
    await parser.drain();
    expect(events).toEqual(['message:business', 'commit:protocol:undefined', 'commit::undefined',
      'message:empty', 'commit:undefined:undefined', 'commit:undefined:12']);
  });

  it('回调失败阻止后续分发和提交；无效 retry 和含 NUL ID 被忽略', async () => {
    const events: string[] = [];
    const parser = new SseStreamParser({
      isActive: () => true,
      onMessage() { throw new Error('handler'); },
      onCommit(id, retry) { events.push(`${id}:${retry}`); },
    });
    parser.receive(bytes('id:a\0b\nretry:1.5\n\ndata:bad\nid:2\n\ndata:late\nid:3\n\n'));
    await expect(parser.drain()).rejects.toThrow('handler');
    expect(events).toEqual([]);
  });

  it('只有真正空行才是边界，支持拆开的 UTF-8，多余尾帧不分发', async () => {
    const messages: unknown[] = [];
    const parser = new SseStreamParser({
      isActive: () => true, onMessage(msg) { messages.push(msg); }, onCommit() {},
    });
    const data = new TextEncoder().encode('data:你好\n \ndata:世界\n\ndata:tail\n');
    for (const byte of data) parser.receive(new Uint8Array([byte]).buffer);
    await parser.drain();
    expect(messages).toEqual([{ raw: '你好\n世界' }]);
  });

  it('未完成帧超过上限时明确失败', () => {
    const parser = new SseStreamParser({ isActive: () => true, onMessage() {}, onCommit() {} });
    expect(() => parser.receive(bytes(`data:${'x'.repeat(1024 * 1024)}`))).toThrow('limit');
  });
});
