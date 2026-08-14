# isURL

校验 URL，要求包含协议和主机名。默认支持 http、https 和 ftp，可限制允许的协议。

## 示例

```ts
import { isURL } from '@base-web-kits/base-tools-ts';
isURL('https://example.com/path?a=1'); // true
isURL('ftp://example.com'); // true
isURL('ftp://example.com', { protocols: ['http', 'https'] }); // false
isURL('example.com'); // false（缺少协议）
```

## 参数

- `s (string)`：待校验的 URL。
- `options.protocols (readonly string[])`：允许的协议，可省略末尾冒号。

## 版本

- 1.0.0 新增
- 1.6.0 支持配置允许的协议
