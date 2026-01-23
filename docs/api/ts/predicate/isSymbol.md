# isSymbol

检查 `value` 是否是 `symbol` 类型。

## 示例

```ts
import { isSymbol } from '@base-web-kits/base-tools-ts';

isSymbol(Symbol('a'));
// 结果: true

isSymbol('a');
// 结果: false
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 `symbol` 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isSymbol](https://es-toolkit.dev/zh_hans/reference/predicate/isSymbol.html)
