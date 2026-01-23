# isWeakSet

检查 `value` 是否是 `WeakSet` 对象。

## 示例

```ts
import { isWeakSet } from '@base-web-kits/base-tools-ts';

isWeakSet(new WeakSet());
// 结果: true

isWeakSet(new Set());
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `WeakSet` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isWeakSet](https://es-toolkit.dev/zh_hans/reference/predicate/isWeakSet.html)
