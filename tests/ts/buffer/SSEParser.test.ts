import { describe, it, expect, vi } from 'vitest';
import { SSEParser, type SSEMessage } from '../../../src/ts/buffer/SSEParser';

describe('ts/buffer SSEParser', () => {
  const encode = (text: string) => new TextEncoder().encode(text).buffer;

  it('should parse simple data message', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    parser.receive(encode('data: hello\n\n'));

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ raw: 'hello' });
  });

  it('should parse json data message', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    parser.receive(encode('data: {"type": "text", "content": "hello"}\n\n'));

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ type: 'text', content: 'hello' });
  });

  it('should parse multi-line data', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    parser.receive(encode('data: line1\ndata: line2\n\n'));

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ raw: 'line1\nline2' });
  });

  it('should handle event, id, and retry fields', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    parser.receive(encode('event: update\nid: 123\nretry: 5000\ndata: {"status": "ok"}\n\n'));

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({
      type: 'update', // event overrides type if type is missing in data or data is raw
      event: 'update',
      id: '123',
      retry: 5000,
      status: 'ok',
    });
  });

  it('should prioritize fields from JSON data', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    // JSON data contains type, id
    parser.receive(
      encode(
        'event: outer-event\nid: outer-id\ndata: {"type": "inner-type", "id": "inner-id", "content": "test"}\n\n',
      ),
    );

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({
      type: 'inner-type', // JSON data type takes precedence
      event: 'outer-event',
      id: 'inner-id', // JSON data id takes precedence
      content: 'test',
    });
  });

  it('should handle chunked data (split across receive calls)', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    const chunk1 = 'data: he';
    const chunk2 = 'llo\n\n';

    parser.receive(encode(chunk1));
    expect(messages).toHaveLength(0);

    parser.receive(encode(chunk2));
    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ raw: 'hello' });
  });

  it('should handle split multi-byte characters', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    const text = 'data: 你好\n\n';
    const bytes = new TextEncoder().encode(text);
    // Split in the middle of '你' (3 bytes)
    const chunk1 = bytes.slice(0, 7); // "data: " (6) + 1st byte of 你
    const chunk2 = bytes.slice(7);

    parser.receive(chunk1.buffer);
    parser.receive(chunk2.buffer);

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ raw: '你好' });
  });

  it('should handle [DONE] message', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    parser.receive(encode('data: [DONE]\n\n'));

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ type: 'DONE' });
  });

  it('should ignore comments', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    parser.receive(encode(': this is a comment\ndata: hello\n\n'));

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ raw: 'hello' });
  });

  it('should handle multiple messages in one chunk', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    parser.receive(encode('data: msg1\n\ndata: msg2\n\n'));

    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual({ raw: 'msg1' });
    expect(messages[1]).toEqual({ raw: 'msg2' });
  });

  it('should flush remaining buffer', () => {
    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    // Send data without double newline
    parser.receive(encode('data: pending'));

    // Flush should trigger processing of what's left as if it ended
    parser.flush();

    // Note: The current implementation of flush -> flushRemainder appends an empty line
    // which might trigger dispatch if the buffer contained a complete field line but no empty line after it.
    // 'data: pending' -> lines=['data: pending', ''] -> processLines -> eventDataLines=['pending'] -> dispatchEvent

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ raw: 'pending' });
  });

  it('should fallback to PolyfillTextDecoder if TextDecoder is undefined', () => {
    const originalTextDecoder = globalThis.TextDecoder;
    // @ts-ignore
    globalThis.TextDecoder = undefined;

    const messages: SSEMessage[] = [];
    const parser = new SSEParser((msg) => messages.push(msg));

    parser.receive(encode('data: polyfill\n\n'));

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ raw: 'polyfill' });

    // Restore
    globalThis.TextDecoder = originalTextDecoder;
  });

  it('should safely handle callback errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const parser = new SSEParser(() => {
      throw new Error('Callback failed');
    });

    parser.receive(encode('data: test\n\n'));

    expect(consoleSpy).toHaveBeenCalledWith('SSEParser onMessage error:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
