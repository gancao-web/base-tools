# dropWhile

创建一个切片数组，去除 `array` 中从起点开始到 `predicate` 返回假值结束部分。

## 示例

```ts
import { dropWhile } from '@base-web-kits/base-tools-ts';

const users = [
  { user: 'barney', active: false },
  { user: 'fred', active: false },
  { user: 'pebbles', active: true },
];

dropWhile(users, (o) => !o.active);
// 结果: objects for ['pebbles']
```

## 参数

- `array (Array)`: 要查询的数组。
- `predicate (Function)`: 每次迭代调用的函数。

## 返回值

- `(Array)`: 返回数组切片。

## 来源

- [es-toolkit dropWhile](https://es-toolkit.dev/zh_hans/reference/array/dropWhile.html)
