# isJSONValue

检查 `value` 是否是有效的 JSON 值。

## 示例

```ts
import { isJSONValue } from '@base-web-kits/base-tools-ts';

isJSONValue({ a: 1 });
// 结果: true

isJSONValue(undefined);
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 JSON 值返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isJSONValue](https://es-toolkit.dev/zh_hans/reference/predicate/isJSONValue.html)
