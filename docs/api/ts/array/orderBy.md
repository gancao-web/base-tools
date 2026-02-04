# orderBy

根据 `iteratees` 指定的迭代函数和 `orders` 指定的排序顺序对 `collection` 进行排序。

## 示例

```ts
import { orderBy } from '@base-web-kits/base-tools-ts';

const users = [
  { user: 'fred', age: 48 },
  { user: 'barney', age: 34 },
  { user: 'fred', age: 40 },
  { user: 'barney', age: 36 },
];

// 以 `user` 升序，`age` 降序排序。
orderBy(users, ['user', 'age'], ['asc', 'desc']);
// 结果: [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `iteratees (Array[] | Function[] | string[])`: 排序的迭代函数。
- `orders (string[])`: 排序顺序 ('asc' 或 'desc')。

## 返回值

- `(Array)`: 返回排序后的新数组。

## 来源

- [es-toolkit orderBy](https://es-toolkit.dev/zh_hans/reference/array/orderBy.html)
