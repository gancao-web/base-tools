# isTypedArray

检查 `value` 是否是 TypedArray (如 Uint8Array)。

## 示例

```ts
import { isTypedArray } from '@base-web-kits/base-tools-ts';

isTypedArray(new Uint8Array(8));
// 结果: true

isTypedArray([]);
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 TypedArray 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isTypedArray](https://es-toolkit.dev/zh_hans/reference/predicate/isTypedArray.html)
