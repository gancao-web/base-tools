# isPlainObject

检查 `value` 是否是普通对象（即由 `{}` 或 `new Object` 创建的对象）。

## 示例

```ts
import { isPlainObject } from '@base-web-kits/base-tools-ts';

isPlainObject({ a: 1 });
// 结果: true

isPlainObject(new Map());
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是普通对象返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isPlainObject](https://es-toolkit.dev/zh_hans/reference/predicate/isPlainObject.html)
