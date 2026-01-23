# isNil

检查 `value` 是否是 `null` 或者 `undefined`。

## 示例

```ts
import { isNil } from '@base-web-kits/base-tools-ts';

isNil(null);
// 结果: true

isNil(undefined);
// 结果: true

isNil(NaN);
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 null 或 undefined 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isNil](https://es-toolkit.dev/zh_hans/reference/predicate/isNil.html)
