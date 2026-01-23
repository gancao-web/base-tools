# isWeakMap

检查 `value` 是否是 `WeakMap` 对象。

## 示例

```ts
import { isWeakMap } from '@base-web-kits/base-tools-ts';

isWeakMap(new WeakMap());
// 结果: true

isWeakMap(new Map());
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `WeakMap` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isWeakMap](https://es-toolkit.dev/zh_hans/reference/predicate/isWeakMap.html)
