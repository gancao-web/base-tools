# partition

创建一个分成两组的元素数组，第一组包含 `predicate` 返回真值的元素，第二组包含 `predicate` 返回假值的元素。

## 示例

```ts
import { partition } from '@base-web-kits/base-tools-ts';

const users = [
  { 'user': 'barney',  'age': 36, 'active': false },
  { 'user': 'fred',    'age': 40, 'active': true },
  { 'user': 'pebbles', 'age': 1,  'active': false }
];

partition(users, o => o.active);
// 结果: [[{ 'user': 'fred',    'age': 40, 'active': true }], [{ 'user': 'barney',  'age': 36, 'active': false }, { 'user': 'pebbles', 'age': 1,  'active': false }]]
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `predicate (Function)`: 每次迭代调用的函数。

## 返回值

- `(Array)`: 返回分组后的数组。

## 来源

- [es-toolkit partition](https://es-toolkit.dev/zh_hans/reference/array/partition.html)
