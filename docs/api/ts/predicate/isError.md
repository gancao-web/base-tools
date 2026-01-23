# isError

检查 `value` 是否是 `Error` 对象。

## 示例

```ts
import { isError } from '@base-web-kits/base-tools-ts';

isError(new Error());
// 结果: true

isError({ message: 'error' });
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `Error` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isError](https://es-toolkit.dev/zh_hans/reference/predicate/isError.html)
