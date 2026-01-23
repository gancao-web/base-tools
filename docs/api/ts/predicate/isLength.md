# isLength

检查 `value` 是否是有效的类数组长度（0 到 MAX_SAFE_INTEGER 之间的整数）。

## 示例

```ts
import { isLength } from '@base-web-kits/base-tools-ts';

isLength(3);
// 结果: true

isLength(-1);
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是有效长度返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isLength](https://es-toolkit.dev/zh_hans/reference/predicate/isLength.html)
