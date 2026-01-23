# isBuffer

检查 `value` 是否是 Buffer。

## 示例

```ts
import { isBuffer } from '@base-web-kits/base-tools-ts';

isBuffer(Buffer.from('a'));
// 结果: true
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 Buffer 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isBuffer](https://es-toolkit.dev/zh_hans/reference/predicate/isBuffer.html)
