# dropRightWhile

创建一个切片数组，去除 `array` 尾部从 `predicate` 返回假值开始到尾部的部分。

## 示例

```ts
import { dropRightWhile } from '@base-web-kits/base-tools-ts';

const users = [
  { user: 'barney', active: true },
  { user: 'fred', active: false },
  { user: 'pebbles', active: false },
];

dropRightWhile(users, (o) => !o.active);
// 结果: objects for ['barney']
```

## 参数

- `array (Array)`: 要查询的数组。
- `predicate (Function)`: 每次迭代调用的函数。

## 返回值

- `(Array)`: 返回数组切片。

## 来源

- [es-toolkit dropRightWhile](https://es-toolkit.dev/zh_hans/reference/array/dropRightWhile.html)
