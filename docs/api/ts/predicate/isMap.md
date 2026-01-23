# isMap

检查 `value` 是否是 `Map` 对象。

## 示例

```ts
import { isMap } from '@base-web-kits/base-tools-ts';

isMap(new Map());
// 结果: true

isMap(new WeakMap());
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `Map` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isMap](https://es-toolkit.dev/zh_hans/reference/predicate/isMap.html)
