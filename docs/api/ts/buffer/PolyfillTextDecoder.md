# PolyfillTextDecoder

`PolyfillTextDecoder` 是 `TextDecoder` 的轻量级 Polyfill 实现。它主要用于在不支持原生 `TextDecoder` 的环境（如部分小程序环境）中进行 UTF-8 文本解码，支持流式解码（Streaming Decode）。

## 引入

```typescript
import PolyfillTextDecoder from '@base-web-kits/base-tools-ts';
// 或者直接引用源码
// import PolyfillTextDecoder from 'src/ts/buffer/PolyfillTextDecoder';
```

## 示例

### 基础解码

```typescript
const decoder = new PolyfillTextDecoder();
const buffer = new TextEncoder().encode('你好 World');
const text = decoder.decode(buffer);
console.log(text); // "你好 World"
```

### 流式解码 (Streaming)

处理被拆分的多字节字符。

```typescript
const decoder = new PolyfillTextDecoder();
const buffer = new TextEncoder().encode('你好'); 
// '你' (3 bytes) + '好' (3 bytes) = 6 bytes

// 模拟拆分：chunk1 包含 '你' 的前 2 个字节
const chunk1 = buffer.slice(0, 2);
// chunk2 包含 '你' 的第 3 个字节和 '好'
const chunk2 = buffer.slice(2);

// 第一块：数据不足以解码出一个字符，返回空字符串，剩余字节暂存
console.log(decoder.decode(chunk1, { stream: true })); // ""

// 第二块：拼接暂存字节，解码成功
console.log(decoder.decode(chunk2, { stream: true })); // "你好"
```

## API

### `decode(input?: ArrayBuffer | Uint8Array, options?: { stream?: boolean }): string`

解码二进制数据为字符串。

- **参数**:
  - `input`: `ArrayBuffer | Uint8Array` (可选) - 要解码的二进制数据。如果不传，通常用于 flush 缓冲区。
  - `options`: 对象 (可选)
    - `stream`: `boolean` (默认 `false`) - 是否开启流式模式。开启后，如果末尾存在不完整的字节序列，会保留在内部缓冲区等待下一次调用拼接；如果关闭，末尾不完整的字节会被替换为 `�` (replacement character)。

- **返回值**:
  - `string` - 解码后的字符串。
