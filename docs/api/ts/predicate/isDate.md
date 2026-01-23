# isDate

检查 `value` 是否是 `Date` 对象。

## 示例

```ts
import { isDate } from '@base-web-kits/base-tools-ts';

isDate(new Date());
// 结果: true

isDate('2023-01-01');
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `Date` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isDate](https://es-toolkit.dev/zh_hans/reference/predicate/isDate.html)
