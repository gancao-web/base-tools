# isEqual

执行深比较来确定两值是否相等。

## 示例

```ts
import { isEqual } from '@base-web-kits/base-tools-ts';

const object = { a: 1 };
const other = { a: 1 };

isEqual(object, other);
// 结果: true

object === other;
// 结果: false
```

## 参数

- `value (any)`: 要比较的值。
- `other (any)`: 另一个要比较的值。

## 返回值

- `(boolean)`: 如果两值相等返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isEqual](https://es-toolkit.dev/zh_hans/reference/predicate/isEqual.html)
