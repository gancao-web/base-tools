# isPrimitive

检查 `value` 是否是原始类型（string, number, boolean, symbol, undefined, null, bigint）。

## 示例

```ts
import { isPrimitive } from '@base-web-kits/base-tools-ts';

isPrimitive(1);
// 结果: true

isPrimitive({});
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是原始类型返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isPrimitive](https://es-toolkit.dev/zh_hans/reference/predicate/isPrimitive.html)
