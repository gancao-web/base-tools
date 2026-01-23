# isArrayBuffer

检查 `value` 是否是 `ArrayBuffer` 类型。

## 示例

```ts
import { isArrayBuffer } from '@base-web-kits/base-tools-ts';

isArrayBuffer(new ArrayBuffer(8));
// 结果: true

isArrayBuffer([]);
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `ArrayBuffer` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isArrayBuffer](https://es-toolkit.dev/zh_hans/reference/predicate/isArrayBuffer.html)
