# isNotNil

检查 `value` 是否**不是** `null` 和 `undefined`。

## 示例

```ts
import { isNotNil } from '@base-web-kits/base-tools-ts';

isNotNil(1);
// 结果: true

isNotNil(null);
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果不是 null 或 undefined 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isNotNil](https://es-toolkit.dev/zh_hans/reference/predicate/isNotNil.html)
