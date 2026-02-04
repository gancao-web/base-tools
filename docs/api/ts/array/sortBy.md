# sortBy

创建一个元素数组，以 `iteratee` 处理的结果升序排序。

## 示例

```ts
import { sortBy } from '@base-web-kits/base-tools-ts';

const users = [
  { user: 'fred', age: 48 },
  { user: 'barney', age: 36 },
  { user: 'fred', age: 40 },
  { user: 'barney', age: 34 },
];

sortBy(users, [(o) => o.user]);
// 结果: [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `iteratees (...(Function|Function[]))`: 排序的迭代函数。

## 返回值

- `(Array)`: 返回排序后的新数组。

## 来源

- [es-toolkit sortBy](https://es-toolkit.dev/zh_hans/reference/array/sortBy.html)
