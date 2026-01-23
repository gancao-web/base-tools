# isEmptyObject

检查 `value` 是否是空对象。

## 示例

```ts
import { isEmptyObject } from '@base-web-kits/base-tools-ts';

isEmptyObject({});
// 结果: true

isEmptyObject({ a: 1 });
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是空对象返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isEmptyObject](https://es-toolkit.dev/zh_hans/reference/predicate/isEmptyObject.html)
