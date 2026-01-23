# isEqualWith

接受一个 `customizer` 函数来定制比较的深比较。

## 示例

```ts
import { isEqualWith } from '@base-web-kits/base-tools-ts';

function customizer(objValue, othValue) {
  if (typeof objValue === 'string' && typeof othValue === 'string') {
    return objValue.toLowerCase() === othValue.toLowerCase();
  }
}

isEqualWith('a', 'A', customizer);
// 结果: true
```

## 参数

- `value (any)`: 要比较的值。
- `other (any)`: 另一个要比较的值。
- `customizer (Function)`: 定制比较的函数。

## 返回值

- `(boolean)`: 如果两值相等返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isEqualWith](https://es-toolkit.dev/zh_hans/reference/predicate/isEqualWith.html)
