# isSet

检查 `value` 是否是 `Set` 对象。

## 示例

```ts
import { isSet } from '@base-web-kits/base-tools-ts';

isSet(new Set());
// 结果: true

isSet(new WeakSet());
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `Set` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isSet](https://es-toolkit.dev/zh_hans/reference/predicate/isSet.html)
