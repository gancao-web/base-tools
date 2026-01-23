# isFunction

检查 `value` 是否是 `function` 类型。

## 示例

```ts
import { isFunction } from '@base-web-kits/base-tools-ts';

isFunction(() => {});
// 结果: true

isFunction({});
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `function` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isFunction](https://es-toolkit.dev/zh_hans/reference/predicate/isFunction.html)
