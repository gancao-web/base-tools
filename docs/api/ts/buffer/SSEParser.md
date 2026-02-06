# SSEParser

`SSEParser` 是一个用于解析 Server-Sent Events (SSE) 流式数据的工具类。它支持自动拼接分块数据、处理多行数据、解析 JSON 内容以及处理 SSE 协议的标准字段（如 `id`, `event`, `retry`）。

## 引入

```typescript
import { SSEParser } from '@base-web-kits/base-tools-ts';
// 或者直接引用源码
// import { SSEParser } from 'src/ts/buffer/SSEParser';
```

## 示例

### 基础用法

```typescript
const parser = new SSEParser((msg) => {
  if (msg.type === 'DONE') {
    console.log('流式传输结束');
    return;
  }
  console.log('收到消息:', msg);
});

// 模拟接收流式数据 (ArrayBuffer)
const encoder = new TextEncoder();
parser.receive(encoder.encode('data: {"content": "Hello"}\n\n'));
parser.receive(encoder.encode('data: {"content": " World"}\n\n'));
parser.receive(encoder.encode('data: [DONE]\n\n'));
```

### 处理分块数据

SSEParser 会自动处理被截断的数据包（例如一个多字节字符被拆分到两个 chunk 中）。

```typescript
const parser = new SSEParser((msg) => console.log(msg));

// 假设 "data: hello\n\n" 被拆分为两部分接收
parser.receive(chunk1); 
parser.receive(chunk2); // 此时才会触发回调
```

## API

### `constructor(onMessage: MessageCallback)`

创建一个新的 SSE 解析器实例。

- **参数**:
  - `onMessage`: `(msg: SSEMessage) => void` - 当解析出一条完整的 SSE 消息时调用的回调函数。

### `receive(buffer: ArrayBuffer)`

接收新的二进制数据块。

- **参数**:
  - `buffer`: `ArrayBuffer` - 接收到的数据块。

### `flush()`

刷新解码器残留数据并处理尾部未换行的内容。通常在流结束时调用，以确保缓冲区中剩余的任何数据都被处理。

## 类型定义

### `SSEMessage`

解析后的消息对象结构。

```typescript
export type SSEMessage = {
  /**
   * SSE 消息类型
   * - 'DONE': 流式数据接收完毕
   * - 'thinking': 思考中
   * - 'text': 文本内容
   * - 其他业务类型 (优先取 JSON 数据中的 type，其次取 event 字段)
   */
  type?: string;

  /** SSE 事件 ID (对应 'id:123') */
  id?: string;

  /** SSE 建议重连时间 (毫秒, 对应 'retry:5000') */
  retry?: number;

  /** SSE 事件类型 (对应 'event:customEvent') */
  event?: string;

  /**
   * 除 type 之外的其他数据
   * - 若 data 是 JSON: 字段会自动展开合并到 msg 对象中
   * - 若 data 非 JSON: 内容放入 raw 字段，如 { raw: 'some text' }
   */
  [key: string]: any;
};
```
