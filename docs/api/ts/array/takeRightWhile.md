# takeRightWhile

创建一个切片数组，从 `array` 尾部开始提取元素，直到 `predicate` 返回假值。

## 示例

```ts
import { takeRightWhile } from '@base-web-kits/base-tools-ts';

const users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];

takeRightWhile(users, o => !o.active);
// 结果: objects for ['fred', 'pebbles']
```

## 参数

- `array (Array)`: 要查询的数组。
- `predicate (Function)`: 每次迭代调用的函数。

## 返回值

- `(Array)`: 返回数组切片。

## 来源

- [es-toolkit takeRightWhile](https://es-toolkit.dev/zh_hans/reference/array/takeRightWhile.html)
