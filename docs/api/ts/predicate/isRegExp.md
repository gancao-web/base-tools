# isRegExp

检查 `value` 是否是 `RegExp` 对象。

## 示例

```ts
import { isRegExp } from '@base-web-kits/base-tools-ts';

isRegExp(/abc/);
// 结果: true

isRegExp('/abc/');
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `RegExp` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isRegExp](https://es-toolkit.dev/zh_hans/reference/predicate/isRegExp.html)
